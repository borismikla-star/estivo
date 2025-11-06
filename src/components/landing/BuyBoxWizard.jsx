
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, RefreshCw, Lightbulb, MapPin, Wallet, Target, Percent, CheckCircle, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPageUrl } from "@/utils";
import InfoTooltip from '@/components/shared/InfoTooltip';

const StepIndicator = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex justify-center items-center mb-6">
      {Array.from({ length: totalSteps }, (_, i) => (
        <React.Fragment key={i}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep > i ? 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-100 border-gray-300 text-gray-500'}`}>
            {currentStep > i + 1 ? <CheckCircle className="w-5 h-5" /> : i + 1}
          </div>
          {i < totalSteps - 1 && <div className={`flex-1 h-1 ${currentStep > i + 1 ? 'bg-blue-600' : 'bg-gray-300'}`} />}
        </React.Fragment>
      ))}
    </div>
  );
};

export default function BuyBoxWizard({ t }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    country: 'Slovakia',
    location: '',
    budget: 200000,
    ltv: 80,
    targetRoi: 10,
    occupancy: 90,
  });
  const [recommendation, setRecommendation] = useState('');

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const generateRecommendation = () => {
    const { budget, location, targetRoi } = formData;
    let recText = "We recommend a ";
    if (budget < 150000) {
      recText += "1-2 room apartment ";
    } else if (budget < 300000) {
      recText += "2-3 room apartment ";
    } else {
      recText += "larger apartment or a family house ";
    }
    
    if (location) {
      recText += `in ${location}`;
    } else {
      recText += "in a district capital";
    }

    if (targetRoi > 12) {
      recText += " with high rental yield potential. ";
    } else {
      recText += ". ";
    }

    recText += "Check the detailed sensitivity analysis in the Estivo app.";
    setRecommendation(recText);
    handleNext();
  };

  const resetWizard = () => {
    setStep(1);
    setRecommendation('');
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-6">
            <h3 className="text-xl font-semibold text-center">Step 1: Location</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Country</label>
                 <Select value={formData.country} onValueChange={(val) => handleChange('country', val)}>
                    <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Slovakia">Slovakia</SelectItem>
                        <SelectItem value="Czechia">Czechia</SelectItem>
                        <SelectItem value="Poland">Poland</SelectItem>
                        <SelectItem value="Hungary">Hungary</SelectItem>
                    </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Location (e.g. city)</label>
                <Input placeholder="Bratislava" value={formData.location} onChange={(e) => handleChange('location', e.target.value)} className="mt-1" />
              </div>
            </div>
            <Button onClick={handleNext} className="w-full">Next <ArrowRight className="w-4 h-4 ml-2" /></Button>
          </motion.div>
        );
      case 2:
        return (
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-6">
            <h3 className="text-xl font-semibold text-center">Step 2: Budget</h3>
            <div className="space-y-4">
              <div>
                <label className="flex justify-between items-center text-sm font-medium">
                  <span>Budget</span>
                  <span className="font-semibold text-blue-600">€{formData.budget.toLocaleString()}</span>
                </label>
                <Slider value={[formData.budget]} onValueChange={([val]) => handleChange('budget', val)} min={50000} max={1000000} step={10000} className="mt-2" />
              </div>
              <div>
                <label className="flex justify-between items-center text-sm font-medium">
                  <InfoTooltip info="Loan-to-Value ratio represents the ratio of a loan to the value of an asset purchased. For example, an 80% LTV means you are borrowing 80% of the property's price.">
                    <span>Loan-to-Value (LTV)</span>
                  </InfoTooltip>
                  <span className="font-semibold text-blue-600">{formData.ltv}%</span>
                </label>
                <Slider value={[formData.ltv]} onValueChange={([val]) => handleChange('ltv', val)} min={0} max={100} step={5} className="mt-2" />
              </div>
            </div>
            <div className="flex gap-4">
              <Button onClick={handleBack} variant="outline" className="w-full"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
              <Button onClick={handleNext} className="w-full">Next <ArrowRight className="w-4 h-4 ml-2" /></Button>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-6">
            <h3 className="text-xl font-semibold text-center">Step 3: Target ROI</h3>
            <div className="space-y-4">
              <div>
                <label className="flex justify-between items-center text-sm font-medium">
                  <InfoTooltip info="Return on Investment. Set your desired annual return on your cash investment.">
                    <span>Target ROI (p.a.)</span>
                  </InfoTooltip>
                  <span className="font-semibold text-blue-600">{formData.targetRoi}%</span>
                </label>
                <Slider value={[formData.targetRoi]} onValueChange={([val]) => handleChange('targetRoi', val)} min={1} max={30} step={1} className="mt-2" />
              </div>
              <div>
                <label className="flex justify-between items-center text-sm font-medium">
                  <InfoTooltip info="The percentage of time the property is expected to be occupied by a tenant.">
                    <span>Occupancy</span>
                  </InfoTooltip>
                  <span className="font-semibold text-blue-600">{formData.occupancy}%</span>
                </label>
                <Slider value={[formData.occupancy]} onValueChange={([val]) => handleChange('occupancy', val)} min={50} max={100} step={1} className="mt-2" />
              </div>
            </div>
            <div className="flex gap-4">
              <Button onClick={handleBack} variant="outline" className="w-full"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
              <Button onClick={generateRecommendation} className="w-full">Get Recommendation <Lightbulb className="w-4 h-4 ml-2" /></Button>
            </div>
          </motion.div>
        );
      case 4:
        const summaryItems = [
            { icon: Globe, label: "Country", value: formData.country },
            { icon: MapPin, label: "Location", value: formData.location || "—" },
            { icon: Wallet, label: "Budget", value: `€${formData.budget.toLocaleString()}` },
            { icon: Percent, label: "LTV", value: `${formData.ltv}%` },
            { icon: Target, label: "Target ROI", value: `${formData.targetRoi}%` },
            { icon: Percent, label: "Occupancy", value: `${formData.occupancy}%` },
        ];
        return (
           <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 text-center">
            <h3 className="text-2xl font-bold">Your BuyBox Recommendation</h3>
            
            <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                {summaryItems.map(item => (
                    <div key={item.label} className="flex items-center gap-1.5">
                        <item.icon className="w-4 h-4 text-gray-500" />
                        <span className="font-semibold">{item.value}</span>
                    </div>
                ))}
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-4 rounded-r-lg text-left">
              <div className="flex">
                <div className="py-1"><Lightbulb className="w-5 h-5 text-blue-500 mr-3" /></div>
                <div>
                  <p className="font-semibold">{recommendation}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button onClick={resetWizard} variant="outline"><RefreshCw className="w-4 h-4 mr-2" /> Start Over</Button>
              <a href={createPageUrl("Dashboard")}>
                <Button>Open Estivo App <ArrowRight className="w-4 h-4 ml-2" /></Button>
              </a>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="p-8 shadow-lg w-full max-w-2xl mx-auto">
        {step < 4 && <StepIndicator currentStep={step} totalSteps={3} />}
        <AnimatePresence mode="wait">
            {renderStep()}
        </AnimatePresence>
    </Card>
  );
}
