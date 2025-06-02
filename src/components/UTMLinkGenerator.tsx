
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Copy } from 'lucide-react';

export const UTMLinkGenerator = () => {
  const [baseUrl, setBaseUrl] = useState('https://matchrate.co');
  const [utmSource, setUtmSource] = useState('');
  const [utmMedium, setUtmMedium] = useState('');
  const [utmCampaign, setUtmCampaign] = useState('');
  const [utmContent, setUtmContent] = useState('');
  const [utmTerm, setUtmTerm] = useState('');
  const [generatedUrl, setGeneratedUrl] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    generateUTMUrl();
  }, [baseUrl, utmSource, utmMedium, utmCampaign, utmContent, utmTerm]);

  const generateUTMUrl = () => {
    const params = new URLSearchParams();
    if (utmSource) params.append('utm_source', utmSource);
    if (utmMedium) params.append('utm_medium', utmMedium);
    if (utmCampaign) params.append('utm_campaign', utmCampaign);
    if (utmContent) params.append('utm_content', utmContent);
    if (utmTerm) params.append('utm_term', utmTerm);
    
    const finalUrl = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
    setGeneratedUrl(finalUrl);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedUrl);
      toast({
        title: "Success",
        description: "URL copied to clipboard!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy URL to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>UTM Link Generator</CardTitle>
        <CardDescription>
          Create trackable URLs for your marketing campaigns
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="baseUrl">Base URL</Label>
              <Select value={baseUrl} onValueChange={setBaseUrl}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="https://matchrate.co">Homepage</SelectItem>
                  <SelectItem value="https://matchrate.co/free-ats-check">ATS Checker</SelectItem>
                  <SelectItem value="https://matchrate.co/blog">Blog</SelectItem>
                  <SelectItem value="https://matchrate.co/review">Resume Review</SelectItem>
                  <SelectItem value="https://matchrate.co/about">About</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="utmSource">Campaign Source (utm_source)</Label>
              <Select value={utmSource} onValueChange={setUtmSource}>
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reddit">Reddit</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="direct">Direct Outreach</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="utmMedium">Campaign Medium (utm_medium)</Label>
              <Select value={utmMedium} onValueChange={setUtmMedium}>
                <SelectTrigger>
                  <SelectValue placeholder="Select medium" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comment">Comment</SelectItem>
                  <SelectItem value="post">Post</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="message">Direct Message</SelectItem>
                  <SelectItem value="group_post">Group Post</SelectItem>
                  <SelectItem value="article">Article</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="story">Story</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="utmCampaign">Campaign Name (utm_campaign)</Label>
              <Input
                id="utmCampaign"
                value={utmCampaign}
                onChange={(e) => setUtmCampaign(e.target.value)}
                placeholder="e.g., ats_help, content_marketing"
              />
            </div>

            <div>
              <Label htmlFor="utmContent">Campaign Content (utm_content)</Label>
              <Input
                id="utmContent"
                value={utmContent}
                onChange={(e) => setUtmContent(e.target.value)}
                placeholder="e.g., r_resumes, career_coach"
              />
            </div>

            <div>
              <Label htmlFor="utmTerm">Campaign Term (utm_term)</Label>
              <Input
                id="utmTerm"
                value={utmTerm}
                onChange={(e) => setUtmTerm(e.target.value)}
                placeholder="e.g., resume_help, ats_optimization"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="generatedUrl">Generated URL</Label>
          <div className="flex gap-2">
            <Input
              id="generatedUrl"
              value={generatedUrl}
              readOnly
              className="flex-1"
            />
            <Button onClick={copyToClipboard} size="sm">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
