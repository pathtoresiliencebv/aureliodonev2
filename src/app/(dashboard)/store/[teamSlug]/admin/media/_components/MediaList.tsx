"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { formatBytes } from "@/utils/format-bytes";
import { formatDate } from "@/utils/format-date";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Copy,
  Download,
  Trash2,
  Edit,
  Eye,
  ExternalLink
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface MediaListProps {
  teamSlug: string;
  searchParams: {
    view?: string;
    search?: string;
    type?: string;
    dateFrom?: string;
    dateTo?: string;
    sort?: string;
  };
}

// Mock data - in real implementation, this would come from the API
const mockMediaFiles = [
  {
    key: "media/teams/team1/products/product1.jpg",
    url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    size: 245760,
    contentType: "image/jpeg",
    uploadedAt: new Date("2024-01-15"),
    metadata: {
      originalName: "product1.jpg",
      uploadedBy: "user1"
    }
  },
  {
    key: "media/teams/team1/products/product2.png",
    url: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=400&fit=crop",
    size: 512000,
    contentType: "image/png",
    uploadedAt: new Date("2024-01-14"),
    metadata: {
      originalName: "product2.png",
      uploadedBy: "user1"
    }
  },
  {
    key: "media/teams/team1/banners/banner1.webp",
    url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop",
    size: 128000,
    contentType: "image/webp",
    uploadedAt: new Date("2024-01-13"),
    metadata: {
      originalName: "banner1.webp",
      uploadedBy: "user2"
    }
  },
  {
    key: "media/teams/team1/avatars/avatar1.svg",
    url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    size: 32000,
    contentType: "image/svg+xml",
    uploadedAt: new Date("2024-01-12"),
    metadata: {
      originalName: "avatar1.svg",
      uploadedBy: "user1"
    }
  }
];

export function MediaList({ teamSlug, searchParams }: MediaListProps) {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const handleSelectFile = (key: string, checked: boolean) => {
    if (checked) {
      setSelectedFiles(prev => [...prev, key]);
    } else {
      setSelectedFiles(prev => prev.filter(k => k !== key));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedFiles(mockMediaFiles.map(f => f.key));
    } else {
      setSelectedFiles([]);
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard");
  };

  const downloadFile = async (file: typeof mockMediaFiles[0]) => {
    try {
      const response = await fetch(file.url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = file.metadata.originalName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
    } catch (error) {
      toast.error("Failed to download file");
    }
  };

  const deleteFile = async (key: string) => {
    try {
      const response = await fetch(`/api/upload?key=${encodeURIComponent(key)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete file');
      }

      toast.success("File deleted successfully");
      // In a real app, you would refresh the media list here
    } catch (error) {
      toast.error("Failed to delete file");
    }
  };

  const getFileTypeBadge = (contentType: string) => {
    if (contentType.startsWith('image/')) {
      return <Badge variant="secondary">Image</Badge>;
    }
    if (contentType.startsWith('video/')) {
      return <Badge variant="outline">Video</Badge>;
    }
    return <Badge variant="outline">File</Badge>;
  };

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSelectAll(selectedFiles.length !== mockMediaFiles.length)}
          >
            {selectedFiles.length === mockMediaFiles.length ? 'Deselect All' : 'Select All'}
          </Button>
          {selectedFiles.length > 0 && (
            <Button variant="outline" size="sm">
              Delete Selected ({selectedFiles.length})
            </Button>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          {mockMediaFiles.length} files
        </div>
      </div>

      {/* Media Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedFiles.length === mockMediaFiles.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="w-16">Preview</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockMediaFiles.map((file) => (
              <TableRow key={file.key}>
                <TableCell>
                  <Checkbox
                    checked={selectedFiles.includes(file.key)}
                    onCheckedChange={(checked) => handleSelectFile(file.key, checked as boolean)}
                  />
                </TableCell>
                <TableCell>
                  <div className="relative w-12 h-12">
                    <Image
                      src={file.url}
                      alt={file.metadata.originalName}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{file.metadata.originalName}</p>
                    <p className="text-sm text-muted-foreground truncate max-w-xs">
                      {file.key}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  {getFileTypeBadge(file.contentType)}
                </TableCell>
                <TableCell>
                  {formatBytes(file.size)}
                </TableCell>
                <TableCell>
                  {formatDate(file.uploadedAt)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => copyUrl(file.url)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy URL
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => downloadFile(file)}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => deleteFile(file.key)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Empty State */}
      {mockMediaFiles.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">📁</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">No media files found</h3>
          <p className="text-muted-foreground mb-4">
            Upload your first media file to get started.
          </p>
        </div>
      )}
    </div>
  );
}
