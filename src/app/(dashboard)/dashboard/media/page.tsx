import { Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Upload,
  Search,
  Filter,
  Download,
  Trash2,
  Eye,
  Image,
  File,
  Video
} from "lucide-react";

// Mock data for media files
const mockMediaFiles = [
  {
    id: "MEDIA-001",
    name: "product-hero.jpg",
    type: "image",
    size: "2.4 MB",
    dimensions: "1920x1080",
    uploaded: "2025-01-21",
    url: "/media/product-hero.jpg"
  },
  {
    id: "MEDIA-002",
    name: "product-demo.mp4",
    type: "video",
    size: "15.2 MB",
    dimensions: "1280x720",
    uploaded: "2025-01-20",
    url: "/media/product-demo.mp4"
  },
  {
    id: "MEDIA-003",
    name: "logo.png",
    type: "image",
    size: "156 KB",
    dimensions: "512x512",
    uploaded: "2025-01-19",
    url: "/media/logo.png"
  },
  {
    id: "MEDIA-004",
    name: "banner-design.psd",
    type: "document",
    size: "8.7 MB",
    dimensions: "N/A",
    uploaded: "2025-01-18",
    url: "/media/banner-design.psd"
  }
];

function getFileIcon(type: string) {
  switch (type) {
    case "image":
      return <Image className="h-4 w-4" />;
    case "video":
      return <Video className="h-4 w-4" />;
    case "document":
      return <File className="h-4 w-4" />;
    default:
      return <File className="h-4 w-4" />;
  }
}

function getTypeColor(type: string) {
  switch (type) {
    case "image":
      return "bg-blue-100 text-blue-800";
    case "video":
      return "bg-purple-100 text-purple-800";
    case "document":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function MediaFilesList() {
  return (
    <div className="space-y-4">
      {mockMediaFiles.map((file) => (
        <Card key={file.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {getFileIcon(file.type)}
                  <span className="font-semibold">{file.name}</span>
                </div>
                <Badge className={getTypeColor(file.type)}>
                  {file.type}
                </Badge>
              </div>
              <div className="text-right">
                <div className="font-semibold">{file.size}</div>
                <div className="text-sm text-muted-foreground">{file.dimensions}</div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm font-medium">Uploaded</div>
                <div className="text-sm text-muted-foreground">{file.uploaded}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Type</div>
                <div className="text-sm text-muted-foreground capitalize">{file.type}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Dimensions</div>
                <div className="text-sm text-muted-foreground">{file.dimensions}</div>
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function MediaFilesSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6 w-16" />
              </div>
              <div className="text-right">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-3 w-20 mt-1" />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
            <div className="mt-4 flex space-x-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function MediaPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Media Library</h1>
          <p className="text-muted-foreground">
            Manage your media files and assets
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Upload Files
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Files</CardTitle>
            <File className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              Media files stored
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Images</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">856</div>
            <p className="text-xs text-muted-foreground">
              Image files
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Videos</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              Video files
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <File className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4 GB</div>
            <p className="text-xs text-muted-foreground">
              Of 10 GB available
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Media Files */}
      <Card>
        <CardHeader>
          <CardTitle>Media Files</CardTitle>
          <CardDescription>
            Upload and manage your media assets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<MediaFilesSkeleton />}>
            <MediaFilesList />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
