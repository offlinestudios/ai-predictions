import { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Share2, 
  Download, 
  Twitter, 
  Linkedin, 
  Copy, 
  Check,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";
import PersonalityRadarChart from "./PersonalityRadarChart";
import { getPsycheMetadata, getCompatibleTypes } from "@/lib/psycheMetadata";

interface ShareablePsycheCardProps {
  profile: {
    displayName: string;
    description: string;
    coreTraits: string[];
    psycheType?: string;
    parameters?: {
      risk_appetite?: number;
      emotional_reactivity?: number;
      time_consistency?: number;
      data_orientation?: number;
      volatility_tolerance?: number;
    };
  };
  userName?: string;
}

export default function ShareablePsycheCard({ profile, userName }: ShareablePsycheCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Get metadata for this psyche type
  const psycheType = profile.psycheType || profile.displayName.toLowerCase().replace(/^the\s+/i, '').replace(/\s+/g, '_');
  const metadata = getPsycheMetadata(psycheType);

  const shareUrl = `${window.location.origin}?ref=psyche`;
  const shareText = `I'm ${profile.displayName} ${metadata?.icon || '✨'} - ${profile.description.split('.')[0]}. Discover your prediction personality at`;

  // Generate image from card
  const generateImage = async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;
    
    setIsGenerating(true);
    try {
      // Dynamically import html2canvas
      const html2canvas = (await import('html2canvas')).default;
      
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0a0a0f',
        scale: 2,
        logging: false,
        useCORS: true,
      });
      
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/png', 1.0);
      });
    } catch (error) {
      console.error('Failed to generate image:', error);
      toast.error('Failed to generate image');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  // Download as image
  const handleDownload = async () => {
    const blob = await generateImage();
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my-psyche-profile-${psycheType}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Image downloaded!');
  };

  // Share to Twitter/X
  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  // Share to LinkedIn
  const shareToLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  // Copy link
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  // Native share (mobile)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        const blob = await generateImage();
        const files = blob ? [new File([blob], 'psyche-profile.png', { type: 'image/png' })] : [];
        
        await navigator.share({
          title: `My Psyche Profile: ${profile.displayName}`,
          text: shareText,
          url: shareUrl,
          ...(files.length > 0 && navigator.canShare?.({ files }) ? { files } : {})
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          toast.error('Failed to share');
        }
      }
    } else {
      copyLink();
    }
  };

  return (
    <div className="space-y-4">
      {/* Shareable Card */}
      <div 
        ref={cardRef}
        className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-[#0a0a0f] via-[#12121a] to-[#0a0a0f] border border-primary/20"
        style={{ minWidth: 320 }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, ${metadata?.color || '#8b5cf6'} 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, ${metadata?.color || '#8b5cf6'} 0%, transparent 50%)`
          }} />
        </div>

        <div className="relative z-10 space-y-4">
          {/* Header with icon and type */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ backgroundColor: `${metadata?.color || '#8b5cf6'}20` }}
              >
                {metadata?.icon || '✨'}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{profile.displayName}</h3>
                {userName && (
                  <p className="text-sm text-muted-foreground">{userName}'s Psyche</p>
                )}
              </div>
            </div>
            
            {/* Rarity badge */}
            {metadata && (
              <div 
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{ 
                  backgroundColor: `${metadata.color}20`,
                  color: metadata.color
                }}
              >
                {metadata.rarityLabel} • {metadata.rarity}%
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {profile.description}
          </p>

          {/* Radar Chart */}
          {profile.parameters && (
            <div className="flex justify-center py-2">
              <PersonalityRadarChart 
                data={profile.parameters} 
                size={180}
                color={metadata?.color || '#8b5cf6'}
              />
            </div>
          )}

          {/* Core Traits as badges */}
          <div className="flex flex-wrap gap-2">
            {profile.coreTraits.slice(0, 4).map((trait, index) => (
              <span 
                key={index}
                className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-white/80 border border-white/10"
              >
                {trait}
              </span>
            ))}
          </div>

          {/* Superpower */}
          {metadata?.superpower && (
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4" style={{ color: metadata.color }} />
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Your Superpower
                </span>
              </div>
              <p className="text-sm text-white">{metadata.superpower}</p>
            </div>
          )}

          {/* Compatibility */}
          {metadata?.compatibleWith && (
            <div className="text-xs text-muted-foreground">
              <span className="font-medium">Best matched with: </span>
              {getCompatibleTypes(metadata.compatibleWith.slice(0, 2)).join(', ')}
            </div>
          )}

          {/* Famous examples */}
          {metadata?.famousExamples && (
            <div className="text-xs text-muted-foreground">
              <span className="font-medium">Famous {profile.displayName.replace('The ', '')}s: </span>
              {metadata.famousExamples.slice(0, 3).join(', ')}
            </div>
          )}

          {/* Branding */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <div className="flex items-center gap-2">
              <img src="/logo.svg" alt="Predicsure" className="w-5 h-5" />
              <span className="text-xs font-medium text-muted-foreground">predicsure.com</span>
            </div>
            <span className="text-xs text-muted-foreground">Discover your psyche →</span>
          </div>
        </div>
      </div>

      {/* Share Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleNativeShare}
          className="flex-1 min-w-[100px]"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          disabled={isGenerating}
          className="flex-1 min-w-[100px]"
        >
          <Download className="w-4 h-4 mr-2" />
          {isGenerating ? 'Generating...' : 'Download'}
        </Button>
      </div>

      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={shareToTwitter}
          className="flex-1"
        >
          <Twitter className="w-4 h-4 mr-2" />
          Twitter
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={shareToLinkedIn}
          className="flex-1"
        >
          <Linkedin className="w-4 h-4 mr-2" />
          LinkedIn
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={copyLink}
          className="flex-1"
        >
          {copied ? (
            <Check className="w-4 h-4 mr-2 text-green-500" />
          ) : (
            <Copy className="w-4 h-4 mr-2" />
          )}
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </div>
    </div>
  );
}
