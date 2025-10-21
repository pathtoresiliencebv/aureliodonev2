"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { formatBytes } from "@/utils/format-bytes";

interface MediaUploadProps {
  teamSlug: string;
}

interface UploadFile {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  result?: {
    url: string;
    key: string;
  };
  error?: string;
}

export function MediaUpload({ teamSlug }: MediaUploadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);

    const newFiles: UploadFile[] = selectedFiles.map(file => ({
      file,
      progress: 0,
      status: 'pending'
    }));

    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFile = async (uploadFile: UploadFile, index: number) => {
    try {
      setFiles(prev => prev.map((f, i) =>
        i === index ? { ...f, status: 'uploading' as const } : f
      ));

      const formData = new FormData();
      formData.append('file', uploadFile.file);
      formData.append('path', `teams/${teamSlug}/media`);
      formData.append('metadata', JSON.stringify({
        teamSlug,
        uploadedAt: new Date().toISOString()
      }));

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const result = await response.json();

      setFiles(prev => prev.map((f, i) =>
        i === index ? {
          ...f,
          status: 'success' as const,
          progress: 100,
          result: {
            url: result.url,
            key: result.key
          }
        } : f
      ));

      toast.success(`Uploaded ${uploadFile.file.name}`);
    } catch (error) {
      setFiles(prev => prev.map((f, i) =>
        i === index ? {
          ...f,
          status: 'error' as const,
          error: error instanceof Error ? error.message : 'Upload failed'
        } : f
      ));

      toast.error(`Failed to upload ${uploadFile.file.name}`);
    }
  };

  const uploadAll = async () => {
    setIsUploading(true);

    const pendingFiles = files.filter(f => f.status === 'pending');

    for (let i = 0; i < pendingFiles.length; i++) {
      const fileIndex = files.findIndex(f => f === pendingFiles[i]);
      await uploadFile(pendingFiles[i], fileIndex);
    }

    setIsUploading(false);
    toast.success('All files uploaded successfully');
  };

  const getStatusIcon = (status: UploadFile['status']) => {
    switch (status) {
      case 'success':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'uploading':
        return <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: UploadFile['status']) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-500">Success</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'uploading':
        return <Badge variant="secondary">Uploading</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)}>
        <Upload className="mr-2 h-4 w-4" />
        Upload Media
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold">Upload Media</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsOpen(false);
              setFiles([]);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <CardContent className="p-6 space-y-4">
          {/* File Input */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium mb-2">Drop files here or click to browse</p>
            <p className="text-sm text-gray-500 mb-4">
              Supports JPG, PNG, WebP, GIF, SVG up to 10MB each
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
            >
              Choose Files
            </Button>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Files to Upload ({files.length})</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFiles([])}
                    disabled={isUploading}
                  >
                    Clear All
                  </Button>
                  <Button
                    onClick={uploadAll}
                    disabled={isUploading || files.every(f => f.status !== 'pending')}
                    size="sm"
                  >
                    {isUploading ? 'Uploading...' : 'Upload All'}
                  </Button>
                </div>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="flex-shrink-0">
                      {getStatusIcon(file.status)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium truncate">
                          {file.file.name}
                        </p>
                        {getStatusBadge(file.status)}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{formatBytes(file.file.size)}</span>
                        <span>•</span>
                        <span>{file.file.type}</span>
                      </div>

                      {file.status === 'uploading' && (
                        <Progress value={file.progress} className="mt-2" />
                      )}

                      {file.status === 'error' && file.error && (
                        <p className="text-xs text-red-500 mt-1">{file.error}</p>
                      )}

                      {file.status === 'success' && file.result && (
                        <p className="text-xs text-green-500 mt-1">
                          Uploaded successfully
                        </p>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      disabled={file.status === 'uploading'}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setIsOpen(false);
                setFiles([]);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setIsOpen(false);
                setFiles([]);
              }}
              disabled={files.some(f => f.status === 'uploading')}
            >
              Done
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
