"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ExternalLink, 
  Settings, 
  Code, 
  Palette,
  Zap,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";

export default function PlasmicIntegrationPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [plasmicProjectId, setPlasmicProjectId] = useState("");
  const [plasmicApiToken, setPlasmicApiToken] = useState("");

  const handleConnect = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsConnected(true);
    setIsLoading(false);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setPlasmicProjectId("");
    setPlasmicApiToken("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Plasmic Integration</h1>
          <p className="text-muted-foreground">
            Connect your Plasmic project to build custom store themes
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Plasmic
          </Button>
          <Button>
            <Code className="h-4 w-4 mr-2" />
            View Documentation
          </Button>
        </div>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Plasmic Connection</span>
            {isConnected ? (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            ) : (
              <Badge variant="destructive">
                <AlertCircle className="h-3 w-3 mr-1" />
                Not Connected
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Connect your Plasmic project to start building custom themes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isConnected ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="project-id">Plasmic Project ID</Label>
                  <Input
                    id="project-id"
                    placeholder="Enter your Plasmic project ID"
                    value={plasmicProjectId}
                    onChange={(e) => setPlasmicProjectId(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="api-token">API Token</Label>
                  <Input
                    id="api-token"
                    type="password"
                    placeholder="Enter your API token"
                    value={plasmicApiToken}
                    onChange={(e) => setPlasmicApiToken(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  onClick={handleConnect}
                  disabled={isLoading || !plasmicProjectId || !plasmicApiToken}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Connect to Plasmic
                    </>
                  )}
                </Button>
                <Button variant="outline">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Get Project ID
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <h3 className="font-medium text-green-800">Successfully Connected!</h3>
                    <p className="text-sm text-green-600">
                      Your Plasmic project is now connected to Aurelio
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Palette className="h-4 w-4" />
                    <span className="font-medium">Themes</span>
                  </div>
                  <p className="text-sm text-muted-foreground">3 active themes</p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Code className="h-4 w-4" />
                    <span className="font-medium">Components</span>
                  </div>
                  <p className="text-sm text-muted-foreground">12 custom components</p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Settings className="h-4 w-4" />
                    <span className="font-medium">Last Sync</span>
                  </div>
                  <p className="text-sm text-muted-foreground">2 minutes ago</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleDisconnect}>
                  Disconnect
                </Button>
                <Button>
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Settings
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Visual Page Builder</CardTitle>
            <CardDescription>
              Drag and drop interface for building store pages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Drag & drop components
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Real-time preview
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Responsive design
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Custom components
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Code Export</CardTitle>
            <CardDescription>
              Export your designs as production-ready code
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                React components
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                TypeScript support
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Tailwind CSS
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Next.js integration
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            Follow these steps to start building with Plasmic
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <div>
                <h4 className="font-medium">Create Plasmic Account</h4>
                <p className="text-sm text-muted-foreground">
                  Sign up at plasmic.app and create a new project
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <div>
                <h4 className="font-medium">Get Project Credentials</h4>
                <p className="text-sm text-muted-foreground">
                  Copy your Project ID and generate an API token
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                3
              </div>
              <div>
                <h4 className="font-medium">Connect to Aurelio</h4>
                <p className="text-sm text-muted-foreground">
                  Enter your credentials above to start building
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
