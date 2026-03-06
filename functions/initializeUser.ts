import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Load app settings (service role to ensure we get them regardless of user role)
        const settingsList = await base44.asServiceRole.entities.AppSettings.list('-updated_date', 1);
        const appSettings = settingsList?.[0] || { beta_mode: false, trial_enabled: false, trial_duration_days: 30 };

        const updates = {};
        const now = new Date();

        // --- Beta mode: upgrade all free users to pro ---
        if (appSettings.beta_mode === true) {
            if (!user.plan || user.plan === 'free') {
                updates.plan = 'pro';
                updates.is_beta_tester = true;
                updates.trial_end_date = null;
            }
        }

        // --- Beta mode OFF ---
        if (appSettings.beta_mode === false) {
            // Downgrade beta testers
            if (user.is_beta_tester === true && user.plan === 'pro') {
                updates.plan = 'free';
                updates.is_beta_tester = false;
                updates.trial_end_date = null;
            }

            // Expire trial
            if (user.plan === 'pro' && user.trial_end_date && new Date(user.trial_end_date) < now) {
                updates.plan = 'free';
            }

            // Start trial for new users
            if (appSettings.trial_enabled && (!user.plan || user.plan === 'free') && !user.trial_end_date) {
                const trialEndDate = new Date();
                trialEndDate.setDate(trialEndDate.getDate() + (appSettings.trial_duration_days || 30));
                updates.plan = 'pro';
                updates.trial_end_date = trialEndDate.toISOString();
            }
        }

        // --- Initialize default user fields if missing ---
        if (!user.country_code) updates.country_code = 'SK';
        if (!user.entity_type) updates.entity_type = 'FO';
        // preferred_language is set client-side only (from browser lang), don't override here

        // Apply updates if any
        if (Object.keys(updates).length > 0) {
            await base44.auth.updateMe(updates);
            return Response.json({ updated: true, updates });
        }

        return Response.json({ updated: false });
    } catch (error) {
        console.error('[initializeUser] Error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});