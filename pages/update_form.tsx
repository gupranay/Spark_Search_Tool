import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import "../app/globals.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import Select from 'react-select';
import { industryOptions, functionalExpertiseOptions } from '@/components/InsertProviderDialog';

const UpdateForm = () => {
  const router = useRouter();
  const { record_id } = router.query;

  const [data, setData] = useState<any>(null);
  const [fields, setFields] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (record_id) {
      fetchData(record_id);
    }
  }, [record_id]);

  const fetchData = async (record_id: string | string[]) => {
    try {
      const response = await fetch(`/api/fetchFormData?recordID=${record_id}`, {
        method: 'POST',
      });
      if (response.ok) {
        const data = await response.json();
        const functionalExpertise = data["Functional Expertise"]
          ? data["Functional Expertise"].split("; ").map((item: string) => ({
              value: item,
              label: item,
            }))
          : [];
        
        setData(data);
        setFields({
          ...data,
          "Functional Expertise": functionalExpertise,
        });
      } else {
        setError('Failed to fetch data from Salesforce.');
      }
    } catch (err) {
      setError('Failed to fetch data from Salesforce.');
    } finally {
      setLoading(false);
    }
  };

  const updateData = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    const submissionData = {
      ...fields,
      "Functional Expertise": fields["Functional Expertise"].map(
        (option: any) => option.value
      ).join("; "),
    };

    try {
      const response = await fetch('/api/updateData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ record_id, fields: submissionData }),
      });
      if (response.ok) {
        setSuccessMessage('Data updated successfully!');
      } else {
        setError('Failed to update data in Salesforce.');
      }
    } catch (err) {
      setError('Failed to update data in Salesforce.');
    }
  };

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFields((prevFields: any) => ({
      ...prevFields,
      [name]: value,
    }));
    setSuccessMessage(null); // Reset success message when any input changes
  };

  const handleFunctionalExpertiseChange = (selectedOptions: any) => {
    setFields((prevFields: any) => ({
      ...prevFields,
      "Functional Expertise": selectedOptions,
    }));
    setSuccessMessage(null); // Reset success message when functional expertise changes
  };

  return (
    <div className="container mx-auto p-4 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Ann Arbor SPARK Vendor Data Updater</h1>
      {loading ? (
        <div className="flex justify-center items-center">
          <Loader2 className="animate-spin" />
          <p className="ml-2">Loading...</p>
        </div>
      ) : error ? (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Edit Data</CardTitle>
          </CardHeader>
          <CardContent>
            {record_id ? (
              <form onSubmit={updateData} className="space-y-4">
                {Object.keys(fields).map((key) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={key}>{key}</Label>
                    {key === "Functional Expertise" ? (
                      <Select
                        isMulti
                        name={key}
                        value={fields[key]}
                        options={functionalExpertiseOptions}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={handleFunctionalExpertiseChange}
                        placeholder="Select Functional Expertise"
                      />
                    ) : (
                      <Input
                        type="text"
                        id={key}
                        name={key}
                        value={fields[key] || ''}
                        onChange={handleInputChange}
                      />
                    )}
                  </div>
                ))}
                {successMessage && (
                  <Alert variant="default" className="mt-4">
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>{successMessage}</AlertDescription>
                  </Alert>
                )}
              </form>
            ) : (
              <p>Record ID not provided in the URL.</p>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" onClick={updateData}>
              Submit Changes
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default UpdateForm;
