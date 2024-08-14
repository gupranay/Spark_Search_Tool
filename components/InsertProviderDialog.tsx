// components/InsertServiceProviderDialog.tsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Select, { GroupBase } from "react-select";
import "../app/globals.css";

interface InsertServiceProviderDialogProps {
  onServiceProviderAdded: () => void;
}

export const industryOptions = [
  { value: "Accounting", label: "Accounting" },
  { value: "Advanced Manufacturing", label: "Advanced Manufacturing" },
  { value: "Advanced Materials", label: "Advanced Materials" },
  { value: "Aeronautics", label: "Aeronautics" },
  { value: "Alt Energy-Battery", label: "Alt Energy-Battery" },
  { value: "Alt Energy-Solar", label: "Alt Energy-Solar" },
  { value: "Alt Energy-Wind", label: "Alt Energy-Wind" },
  { value: "Alternative Energy", label: "Alternative Energy" },
  { value: "Auto-Connected Vehicle", label: "Auto-Connected Vehicle" },
  { value: "Auto-Design", label: "Auto-Design" },
  { value: "Auto-Engineering", label: "Auto-Engineering" },
  { value: "Automotive", label: "Automotive" },
  { value: "Biofuels", label: "Biofuels" },
  { value: "Business Services", label: "Business Services" },
  { value: "Call Center", label: "Call Center" },
  { value: "Cannabis", label: "Cannabis" },
  { value: "Clean Technology", label: "Clean Technology" },
  { value: "Communications", label: "Communications" },
  { value: "Digital Media", label: "Digital Media" },
  { value: "Education", label: "Education" },
  { value: "Energy", label: "Energy" },
  { value: "Engineering", label: "Engineering" },
  { value: "Environmental", label: "Environmental" },
  { value: "Financial Services", label: "Financial Services" },
  { value: "Food & Beverage processing", label: "Food & Beverage processing" },
  { value: "Headquarters", label: "Headquarters" },
  { value: "Healthcare", label: "Healthcare" },
  { value: "Home Improvement", label: "Home Improvement" },
  { value: "Homeland Security", label: "Homeland Security" },
  { value: "Hospitality", label: "Hospitality" },
  { value: "Human Resources", label: "Human Resources" },
  { value: "Information Technology", label: "Information Technology" },
  { value: "Insurance Provider", label: "Insurance Provider" },
  { value: "Internet Security", label: "Internet Security" },
  { value: "IT-Applications", label: "IT-Applications" },
  { value: "IT-Database Management", label: "IT-Database Management" },
  { value: "IT-Infrastructure", label: "IT-Infrastructure" },
  {
    value: "IT-Networking/Computers-Hardware",
    label: "IT-Networking/Computers-Hardware",
  },
  { value: "IT-Social Networking", label: "IT-Social Networking" },
  { value: "Landscape /Lawn Care", label: "Landscape /Lawn Care" },
  { value: "Legal", label: "Legal" },
  { value: "Legal-Corporate", label: "Legal-Corporate" },
  { value: "Legal-IP", label: "Legal-IP" },
  {
    value: "Life Science - Bioagriculture",
    label: "Life Science - Bioagriculture",
  },
  {
    value: "Life Science - Medical Device",
    label: "Life Science - Medical Device",
  },
  { value: "Life Science - Other", label: "Life Science - Other" },
  {
    value: "Life Science - Pharma/Biotech",
    label: "Life Science - Pharma/Biotech",
  },
  { value: "Liquor", label: "Liquor" },
  { value: "Logistics", label: "Logistics" },
  { value: "Manufacturing", label: "Manufacturing" },
  { value: "MEMS", label: "MEMS" },
  { value: "Mobility", label: "Mobility" },
  { value: "Non-profit agencies", label: "Non-profit agencies" },
  { value: "Optics", label: "Optics" },
  { value: "R&D", label: "R&D" },
  { value: "Real Estate", label: "Real Estate" },
  { value: "Retail", label: "Retail" },
  { value: "Software", label: "Software" },
  { value: "Software - SaaS", label: "Software - SaaS" },
  { value: "Space/Satellites", label: "Space/Satellites" },
  { value: "Sports", label: "Sports" },
  { value: "Telecom", label: "Telecom" },
  { value: "Water Testing", label: "Water Testing" },
];

export const functionalExpertiseOptions = [
  { value: "Accounting", label: "Accounting" },
  { value: "Animation", label: "Animation" },
  { value: "App /Game Marketing", label: "App /Game Marketing" },
  { value: "Augmented Reality", label: "Augmented Reality" },
  { value: "Branding", label: "Branding" },
  { value: "Business Development", label: "Business Development" },
  { value: "Business to Business (B2B)", label: "Business to Business (B2B)" },
  { value: "Collateral Development", label: "Collateral Development" },
  {
    value: "Consumer Packaged Goods (CPG)",
    label: "Consumer Packaged Goods (CPG)",
  },
  { value: "Content Marketing", label: "Content Marketing" },
  { value: "Crowdfunding", label: "Crowdfunding" },
  { value: "Customer Discovery", label: "Customer Discovery" },
  { value: "Data Analysis", label: "Data Analysis" },
  { value: "Digital Advertising", label: "Digital Advertising" },
  { value: "Digital Engagement", label: "Digital Engagement" },
  { value: "Direct to Consumer (DTC)", label: "Direct to Consumer (DTC)" },
  { value: "E-commerce", label: "E-commerce" },
  { value: "EIR", label: "EIR" },
  { value: "EIR - GEM", label: "EIR - GEM" },
  { value: "E-learning", label: "E-learning" },
  { value: "Email Marketing", label: "Email Marketing" },
  { value: "Engineering", label: "Engineering" },
  { value: "Event Planning", label: "Event Planning" },
  { value: "Finance", label: "Finance" },
  { value: "Fundraising", label: "Fundraising" },
  {
    value: "Government Relations / Regulatory",
    label: "Government Relations / Regulatory",
  },
  { value: "Graphic Design", label: "Graphic Design" },
  { value: "Human Resources", label: "Human Resources" },
  { value: "Illustration", label: "Illustration" },
  { value: "Intellectual Property", label: "Intellectual Property" },
  {
    value: "Large Scale Graphics / Signage",
    label: "Large Scale Graphics / Signage",
  },
  { value: "Legal", label: "Legal" },
  { value: "Manufacturing", label: "Manufacturing" },
  { value: "Marketing", label: "Marketing" },
  { value: "Marketing Automation", label: "Marketing Automation" },
  { value: "Media Training", label: "Media Training" },
  { value: "Mobile Geofencing", label: "Mobile Geofencing" },
  { value: "Operations", label: "Operations" },
  { value: "Photography", label: "Photography" },
  { value: "PR/Communications", label: "PR/Communications" },
  {
    value: "Pre-order Sales & Marketing",
    label: "Pre-order Sales & Marketing",
  },
  { value: "Product Development", label: "Product Development" },
  { value: "Public Relations", label: "Public Relations" },
  { value: "Sales", label: "Sales" },
  { value: "SEO / website analytics", label: "SEO / website analytics" },
  { value: "Social Media", label: "Social Media" },
  { value: "Software Development", label: "Software Development" },
  { value: "Strategy", label: "Strategy" },
  { value: "Supply Chain", label: "Supply Chain" },
  { value: "Technology Demos", label: "Technology Demos" },
  { value: "UI/UX", label: "UI/UX" },
  { value: "Video Production", label: "Video Production" },
  { value: "Virtual Reality", label: "Virtual Reality" },
  {
    value: "Website Design & Development",
    label: "Website Design & Development",
  },
  { value: "Writing", label: "Writing" },
];

const InsertServiceProviderDialog: React.FC<
  InsertServiceProviderDialogProps
> = ({ onServiceProviderAdded }) => {
  const [formData, setFormData] = useState({
    Company: "",
    "First Name": "",
    "Last Name": "",
    Email: "",
    "Functional Expertise": [],
    "Industry Experience": [],
    Description: "",
    Website: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isError, setIsError] = useState(false);
  const [validationError, setValidationError] = useState("");

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleIndustryChange = (selectedOptions: any) => {
    setFormData((prev) => ({
      ...prev,
      "Industry Experience": selectedOptions,
    }));
  };

  const handleFunctionalExpertiseChange = (selectedOptions: any) => {
    setFormData((prev) => ({
      ...prev,
      "Functional Expertise": selectedOptions,
    }));
  };

  const validateForm = () => {
    for (const key in formData) {
      if (
        key !== "Industry Experience" &&
        key !== "Functional Expertise" &&
        formData[key as keyof typeof formData] === ""
      ) {
        return `Please fill out the ${key} field.`;
      }
    }
    return "";
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setValidationError(validationError);
      return;
    }

    const secretUrl = process.env.NEXT_PUBLIC_MAKE_URL_V3;

    const submissionData = {
      ...formData,
      "Industry Experience": formData["Industry Experience"]
        .map((option: any) => option.value)
        .join("; "), // Convert selected options to semicolon-separated string
      "Functional Expertise": formData["Functional Expertise"]
        .map((option: any) => option.value)
        .join("; "), // Convert selected options to semicolon-separated string
    };

    try {
      const response = await fetch(
        `${secretUrl}?${new URLSearchParams(submissionData)}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      onServiceProviderAdded();
      setIsSubmitted(true);
      setIsError(false);
      // Clear form data
      setFormData({
        Company: "",
        "First Name": "",
        "Last Name": "",
        Email: "",
        "Functional Expertise": [],
        "Industry Experience": [],
        Description: "",
        Website: "",
      });
    } catch (error) {
      console.error("Error adding service provider:", error);
      setIsSubmitted(true);
      setIsError(true);
    }
  };

  return (
    <Dialog
      open={isSubmitted ? true : undefined}
      onOpenChange={() => setIsSubmitted(false)}
    >
      <DialogTrigger>
        <Button variant="default">Add Service Provider</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a New Service Provider</DialogTitle>
          <DialogDescription>
            {isSubmitted ? (
              isError ? (
                <div
                  style={{
                    backgroundColor: "#f8d7da",
                    color: "#721c24",
                    padding: "1rem",
                    borderRadius: "0.25rem",
                    marginTop: "1rem",
                  }}
                >
                  Error uploading data. Please try again.
                </div>
              ) : (
                <div
                  style={{
                    backgroundColor: "#d4edda",
                    color: "#155724",
                    padding: "1rem",
                    borderRadius: "0.25rem",
                    marginTop: "1rem",
                  }}
                >
                  Thank you for your submission! Our team will review it
                  shortly.
                </div>
              )
            ) : (
              "Fill out the form below to be a new service provider. SPARK reviews all submissions before they are added to the database."
            )}
          </DialogDescription>
        </DialogHeader>
        {!isSubmitted && (
          <form className="space-y-4">
            <Input
              type="text"
              name="Company"
              value={formData.Company}
              onChange={handleFormChange}
              placeholder="Company"
              required
            />
            <Input
              type="text"
              name="First Name"
              value={formData["First Name"]}
              onChange={handleFormChange}
              placeholder="First Name"
              required
            />
            <Input
              type="text"
              name="Last Name"
              value={formData["Last Name"]}
              onChange={handleFormChange}
              placeholder="Last Name"
              required
            />
            <Input
              type="email"
              name="Email"
              value={formData.Email}
              onChange={handleFormChange}
              placeholder="Email"
              required
            />
            <Select
              isMulti
              name="Functional Expertise"
              options={functionalExpertiseOptions as unknown as readonly GroupBase<never>[]}
              className="basic-multi-select"
              classNamePrefix="select"
              onChange={handleFunctionalExpertiseChange}
              placeholder="Functional Expertise"
              value={formData["Functional Expertise"]}
            />

            <Select
              isMulti
              name="Industry Experience"
              options={industryOptions as unknown as readonly GroupBase<never>[]}
              className="basic-multi-select"
              classNamePrefix="select"
              onChange={handleIndustryChange}
              placeholder="Industry Experience"
              value={formData["Industry Experience"]}
            />

            <Input
              type="text"
              name="Description"
              value={formData.Description}
              onChange={handleFormChange}
              placeholder="Description"
              required
            />
            <Input
              type="url"
              name="Website"
              value={formData.Website}
              onChange={handleFormChange}
              placeholder="Website"
              required
            />
            <Button type="button" onClick={handleSubmit}>
              Submit
            </Button>
            {validationError && (
              <div
                style={{
                  backgroundColor: "#f8d7da",
                  color: "#721c24",
                  padding: "1rem",
                  borderRadius: "0.25rem",
                }}
              >
                {validationError}
              </div>
            )}
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InsertServiceProviderDialog;
