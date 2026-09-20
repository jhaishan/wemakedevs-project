import { useState } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { getPresignedUrl, uploadFileToS3 } from '../../lib/api';

interface ComplaintFormProps {
  onSubmit: (data: { rawText: string; roomNumber: string; studentId: string; imageUrl?: string }) => void;
  isSubmitting?: boolean;
  disabled?: boolean;
}

export function ComplaintForm({ onSubmit, isSubmitting, disabled }: ComplaintFormProps) {
  const { user } = useUser();
  const [rawText, setRawText] = useState('');
  const [roomNumber, setRoomNumber] = useState(user?.roomNumber || '');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    setUploadStatus('uploading');
    try {
      const { uploadUrl, publicUrl } = await getPresignedUrl(file.type);
      await uploadFileToS3(uploadUrl, file);
      setImageUrl(publicUrl);
      setUploadStatus('done');
    } catch {
      setUploadStatus('error');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim() || !roomNumber.trim() || !user) return;
    onSubmit({
      rawText: rawText.trim(),
      roomNumber: roomNumber.trim(),
      studentId: user.id,
      ...(imageUrl ? { imageUrl } : {}),
    });
  };

  const isFormDisabled = disabled || isSubmitting || uploadStatus === 'uploading';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report an Issue</CardTitle>
        <CardDescription>Describe the maintenance problem you are experiencing</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <Textarea
              placeholder="Describe your maintenance issue..."
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              disabled={isFormDisabled}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Room Number</label>
            <Input
              placeholder="e.g., A-101"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              disabled={isFormDisabled}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Photo (optional)</label>
            <div className="flex items-center gap-4">
              <label
                className={`flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm cursor-pointer hover:bg-gray-50 transition-colors ${
                  isFormDisabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Upload className="h-4 w-4" />
                Choose File
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isFormDisabled}
                />
              </label>
              {uploadStatus === 'uploading' && (
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </span>
              )}
              {uploadStatus === 'done' && (
                <span className="text-sm text-green-600">Upload complete</span>
              )}
              {uploadStatus === 'error' && (
                <span className="text-sm text-red-600">Upload failed</span>
              )}
            </div>
            {imagePreview && (
              <div className="mt-2 relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-24 w-24 object-cover rounded-md border border-gray-200"
                />
                <div className="absolute -top-1 -right-1 bg-white rounded-full">
                  <ImageIcon className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            )}
          </div>

          <Button type="submit" disabled={isFormDisabled || !rawText.trim() || !roomNumber.trim()} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Complaint'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
