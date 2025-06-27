
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ArrowLeft, Calendar as CalendarIcon, Upload, Clock, CreditCard, Check } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const BookingSection = ({ selectedPackage, onBack }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    packageId: selectedPackage?.id || '',
    date: null,
    time: '',
    clientName: '',
    clientuserat: '',
    clientPhone: '',
    specialRequests: '',
    uploadedFiles: []
  });

  const steps = [
    { id: 1, title: 'Package & Date', desc: 'Select your session details' },
    { id: 2, title: 'Personal Info', desc: 'Tell us about yourself' },
    { id: 3, title: 'Upload & Notes', desc: 'Share inspiration photos' },
    { id: 4, title: 'Payment', desc: 'Complete your booking' }
  ];

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    handleInputChange('uploadedFiles', [...formData.uploadedFiles, ...files]);
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    console.log('Booking submitted:', formData);
    // Here you would integrate with your booking system
    toast('Booking submitted successfully! You will receive a confirmation email shortly.');
  };

  return (
    <section className="py-8 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-4 hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Services
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Book Your Session</h1>
            {selectedPackage && (
              <p className="text-lg text-slate-600">
                {selectedPackage.name} - ${selectedPackage.price}
              </p>
            )}
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold ${
                  currentStep >= step.id 
                    ? 'bg-amber-500 border-amber-500 text-white' 
                    : 'border-slate-300 text-slate-400'
                }`}>
                  {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                </div>
                <div className="ml-3 hidden md:block">
                  <div className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-slate-800' : 'text-slate-400'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-slate-500">{step.desc}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-amber-500' : 'bg-slate-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8">
            {/* Step 1: Package & Date */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-4">Session Details</h3>
                  
                  {selectedPackage && (
                    <Card className="bg-amber-50 border-amber-200 mb-6">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-slate-800">{selectedPackage.name}</h4>
                            <p className="text-sm text-slate-600">{selectedPackage.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-slate-800">${selectedPackage.price}</div>
                            <div className="text-sm text-slate-500">{selectedPackage.duration}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-base font-medium text-slate-700 mb-2 block">
                      Select Date *
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal h-12",
                            !formData.date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.date ? format(formData.date, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.date}
                          onSelect={(date) => handleInputChange('date', date)}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label className="text-base font-medium text-slate-700 mb-2 block">
                      Preferred Time *
                    </Label>
                    <Select value={formData.time} onValueChange={(value) => handleInputChange('time', value)}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select time slot" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2" />
                              {time}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

              </div>
            )}

            {/* Step 2: Personal Info */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Your Information</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-base font-medium text-slate-700 mb-2 block">
                      Nickname *
                    </Label>
                    <Input
                      value={formData.clientName}
                      onChange={(e) => handleInputChange('clientName', e.target.value)}
                      placeholder="mexy"
                      className="h-12"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium text-slate-700 mb-2 block">
                    TikTok or Instagram username 
                  </Label>
                  <Input
                    value={formData.clientuserat}
                    onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                    placeholder="sam_mexy"
                    className="h-12"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Upload & Notes */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Inspiration & Notes</h3>
                
                <div>
                  <Label className="text-base font-medium text-slate-700 mb-2 block">
                    Upload Reference Photos (Optional)
                  </Label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-amber-500 transition-colors">
                    <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 mb-4">
                      Drag and drop your inspiration photos here, or click to browse
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button asChild variant="outline">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        Choose Files
                      </label>
                    </Button>
                  </div>
                  
                  {formData.uploadedFiles.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-slate-700 mb-2">
                        Uploaded Files ({formData.uploadedFiles.length}):
                      </p>
                      <div className="space-y-1">
                        {formData.uploadedFiles.map((file, index) => (
                          <div key={index} className="text-sm text-slate-600 bg-slate-50 p-2 rounded">
                            {file.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <Label className="text-base font-medium text-slate-700 mb-2 block">
                    Special Requests or Notes
                  </Label>
                  <Textarea
                    value={formData.specialRequests}
                    onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                    placeholder="Tell us about your vision, any specific shots you want, or special requirements..."
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Payment */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Complete Your Booking</h3>
                
                {/* Booking Summary */}
                <Card className="bg-slate-50">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-slate-800 mb-4">Booking Summary</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Package:</span>
                        <span className="font-medium">{selectedPackage?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Date:</span>
                        <span className="font-medium">
                          {formData.date ? format(formData.date, "PPP") : 'Not selected'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Time:</span>
                        <span className="font-medium">{formData.time || 'Not selected'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Location:</span>
                      </div>
                      <hr className="my-4" />
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total:</span>
                        <span>${selectedPackage?.price || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                  <div className="flex items-start">
                    <CreditCard className="w-5 h-5 text-amber-600 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">Payment Information</h4>
                      <p className="text-slate-600 text-sm">
                        A 50% deposit is required to secure your booking. The remaining balance will be due on the day of your session. 
                        You will receive a secure payment link via email after clicking "Complete Booking".
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8 border-t">
              <Button 
                variant="outline" 
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6"
              >
                Previous
              </Button>
              
              {currentStep < 4 ? (
                <Button 
                  onClick={nextStep}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6"
                >
                  Next Step
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8"
                >
                  Complete Booking
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default BookingSection;
