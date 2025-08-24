#!/usr/bin/env python3
"""
YKFA Website Image Downloader and Converter
Downloads images from various sources, renames them appropriately,
converts to WebP format with compression, and places them in correct website directories.
"""

import os
import sys
import requests
import hashlib
from urllib.parse import urlparse, unquote
from pathlib import Path
import json
from typing import Dict, List, Tuple
from PIL import Image, ImageOps
import argparse
from datetime import datetime

class YKFAImageDownloader:
    def __init__(self, base_dir: str = None):
        """Initialize the image downloader with base directory."""
        self.base_dir = Path(base_dir) if base_dir else Path.cwd()
        self.public_dir = self.base_dir / "public"
        self.img_dir = self.public_dir / "img"
        
        # Create directories if they don't exist
        self.img_dir.mkdir(parents=True, exist_ok=True)
        
        # Website image categories and their naming conventions
        self.image_categories = {
            'hero': {
                'dir': self.img_dir,
                'prefix': 'hero-',
                'max_width': 1920,
                'quality': 85
            },
            'about': {
                'dir': self.img_dir,
                'prefix': 'about-',
                'max_width': 800,
                'quality': 80
            },
            'programs': {
                'dir': self.img_dir,
                'prefix': 'program-',
                'max_width': 600,
                'quality': 75
            },
            'membership': {
                'dir': self.img_dir,
                'prefix': 'membership-',
                'max_width': 800,
                'quality': 80
            },
            'gallery': {
                'dir': self.img_dir,
                'prefix': 'gallery-',
                'max_width': 1200,
                'quality': 80
            },
            'trainers': {
                'dir': self.img_dir,
                'prefix': 'trainer-',
                'max_width': 400,
                'quality': 75
            },
            'facilities': {
                'dir': self.img_dir,
                'prefix': 'facility-',
                'max_width': 800,
                'quality': 80
            },
            'blog': {
                'dir': self.img_dir,
                'prefix': 'blog-',
                'max_width': 800,
                'quality': 75
            },
            'general': {
                'dir': self.img_dir,
                'prefix': 'ykfa-',
                'max_width': 1000,
                'quality': 80
            }
        }
        
        # Headers for requests to appear more like a browser
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        # Track downloaded files
        self.download_log = []
    
    def sanitize_filename(self, filename: str) -> str:
        """Sanitize filename for safe filesystem usage."""
        # Remove or replace unsafe characters
        unsafe_chars = '<>:"/\\|?*'
        for char in unsafe_chars:
            filename = filename.replace(char, '_')
        
        # Remove extra spaces and make lowercase
        filename = '_'.join(filename.split()).lower()
        
        # Remove file extension (we'll add .webp later)
        return os.path.splitext(filename)[0]
    
    def get_image_hash(self, image_path: str) -> str:
        """Generate MD5 hash of image to detect duplicates."""
        try:
            with open(image_path, 'rb') as f:
                return hashlib.md5(f.read()).hexdigest()[:8]
        except:
            return None
    
    def download_image(self, url: str, category: str, custom_name: str = None) -> Tuple[bool, str]:
        """Download image from URL."""
        try:
            print(f"Downloading: {url}")
            
            # Make request
            response = requests.get(url, headers=self.headers, timeout=30)
            response.raise_for_status()
            
            # Get content type
            content_type = response.headers.get('content-type', '')
            if not content_type.startswith('image/'):
                print(f"  ❌ Not an image: {content_type}")
                return False, f"Not an image: {content_type}"
            
            # Generate filename
            if custom_name:
                filename = self.sanitize_filename(custom_name)
            else:
                # Extract filename from URL
                parsed_url = urlparse(url)
                original_name = unquote(os.path.basename(parsed_url.path))
                if not original_name or original_name == '/':
                    original_name = f"image_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
                filename = self.sanitize_filename(original_name)
            
            # Create temporary file path
            temp_path = self.img_dir / f"temp_{filename}"
            
            # Save original image
            with open(temp_path, 'wb') as f:
                f.write(response.content)
            
            # Convert to WebP
            webp_path = self.convert_to_webp(temp_path, category, filename)
            
            # Remove temporary file
            if temp_path.exists():
                temp_path.unlink()
            
            if webp_path:
                print(f"  ✅ Saved as: {webp_path.name}")
                self.download_log.append({
                    'url': url,
                    'category': category,
                    'filename': webp_path.name,
                    'path': str(webp_path),
                    'size': webp_path.stat().st_size,
                    'timestamp': datetime.now().isoformat()
                })
                return True, str(webp_path)
            else:
                return False, "Failed to convert to WebP"
                
        except requests.RequestException as e:
            error_msg = f"Download failed: {str(e)}"
            print(f"  ❌ {error_msg}")
            return False, error_msg
        except Exception as e:
            error_msg = f"Unexpected error: {str(e)}"
            print(f"  ❌ {error_msg}")
            return False, error_msg
    
    def convert_to_webp(self, input_path: Path, category: str, base_filename: str) -> Path:
        """Convert image to WebP format with appropriate compression."""
        try:
            # Get category settings
            cat_settings = self.image_categories.get(category, self.image_categories['general'])
            
            # Open and process image
            with Image.open(input_path) as img:
                # Convert to RGB if necessary
                if img.mode in ('RGBA', 'LA', 'P'):
                    # Create white background for transparent images
                    background = Image.new('RGB', img.size, (255, 255, 255))
                    if img.mode == 'P':
                        img = img.convert('RGBA')
                    background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                    img = background
                elif img.mode != 'RGB':
                    img = img.convert('RGB')
                
                # Auto-orient based on EXIF data
                img = ImageOps.exif_transpose(img)
                
                # Resize if larger than max width
                max_width = cat_settings['max_width']
                if img.width > max_width:
                    ratio = max_width / img.width
                    new_height = int(img.height * ratio)
                    img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
                
                # Generate final filename
                prefix = cat_settings['prefix']
                final_filename = f"{prefix}{base_filename}.webp"
                output_path = cat_settings['dir'] / final_filename
                
                # Handle filename conflicts
                counter = 1
                while output_path.exists():
                    final_filename = f"{prefix}{base_filename}_{counter}.webp"
                    output_path = cat_settings['dir'] / final_filename
                    counter += 1
                
                # Save as WebP with compression
                img.save(
                    output_path,
                    'WebP',
                    quality=cat_settings['quality'],
                    method=6,  # Best compression
                    optimize=True
                )
                
                return output_path
                
        except Exception as e:
            print(f"  ❌ Conversion failed: {str(e)}")
            return None
    
    def download_from_list(self, image_list: List[Dict]) -> Dict:
        """Download images from a list of image specifications."""
        results = {
            'successful': 0,
            'failed': 0,
            'errors': []
        }
        
        print(f"\n🚀 Starting download of {len(image_list)} images...\n")
        
        for i, img_spec in enumerate(image_list, 1):
            url = img_spec.get('url')
            category = img_spec.get('category', 'general')
            custom_name = img_spec.get('name')
            
            if not url:
                print(f"{i:2d}. ❌ Missing URL in specification")
                results['failed'] += 1
                continue
            
            print(f"{i:2d}. Processing {category} image...")
            success, message = self.download_image(url, category, custom_name)
            
            if success:
                results['successful'] += 1
            else:
                results['failed'] += 1
                results['errors'].append(f"{url}: {message}")
        
        return results
    
    def save_download_log(self) -> str:
        """Save download log to JSON file."""
        log_file = self.base_dir / f"download_log_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        log_data = {
            'timestamp': datetime.now().isoformat(),
            'total_downloads': len(self.download_log),
            'downloads': self.download_log
        }
        
        with open(log_file, 'w') as f:
            json.dump(log_data, f, indent=2)
        
        return str(log_file)
    
    def print_summary(self, results: Dict) -> None:
        """Print download summary."""
        print(f"\n{'='*50}")
        print(f"📊 DOWNLOAD SUMMARY")
        print(f"{'='*50}")
        print(f"✅ Successful: {results['successful']}")
        print(f"❌ Failed: {results['failed']}")
        print(f"📁 Output directory: {self.img_dir}")
        
        if results['errors']:
            print(f"\n❌ Errors:")
            for error in results['errors']:
                print(f"   • {error}")
        
        if self.download_log:
            log_file = self.save_download_log()
            print(f"\n📋 Download log saved: {log_file}")


def main():
    """Main function to run the image downloader."""
    parser = argparse.ArgumentParser(description='Download and convert images for YKFA website')
    parser.add_argument('--config', type=str, help='JSON config file with image URLs')
    parser.add_argument('--url', type=str, help='Single image URL to download')
    parser.add_argument('--category', type=str, default='general', 
                       choices=['hero', 'about', 'programs', 'membership', 'gallery', 
                               'trainers', 'facilities', 'blog', 'general'],
                       help='Image category')
    parser.add_argument('--name', type=str, help='Custom name for the image')
    parser.add_argument('--dir', type=str, help='Base directory (default: current directory)')
    
    args = parser.parse_args()
    
    # Initialize downloader
    downloader = YKFAImageDownloader(args.dir)
    
    print("🎯 YKFA Website Image Downloader")
    print("================================")
    
    if args.config:
        # Load from config file
        try:
            with open(args.config, 'r') as f:
                config = json.load(f)
            
            image_list = config.get('images', [])
            if not image_list:
                print("❌ No images found in config file")
                sys.exit(1)
            
            results = downloader.download_from_list(image_list)
            downloader.print_summary(results)
            
        except FileNotFoundError:
            print(f"❌ Config file not found: {args.config}")
            sys.exit(1)
        except json.JSONDecodeError:
            print(f"❌ Invalid JSON in config file: {args.config}")
            sys.exit(1)
    
    elif args.url:
        # Single URL download
        print(f"Downloading single image: {args.url}")
        success, message = downloader.download_image(args.url, args.category, args.name)
        
        if success:
            print(f"✅ Successfully downloaded: {message}")
        else:
            print(f"❌ Download failed: {message}")
            sys.exit(1)
    
    else:
        # Interactive mode - create sample config
        sample_config = {
            "images": [
                {
                    "url": "https://example.com/hero-image.jpg",
                    "category": "hero",
                    "name": "main-hero-banner"
                },
                {
                    "url": "https://example.com/about-image.jpg",
                    "category": "about",
                    "name": "master-yaseen-profile"
                },
                {
                    "url": "https://example.com/program-mma.jpg",
                    "category": "programs",
                    "name": "mma-training-session"
                }
            ]
        }
        
        config_file = downloader.base_dir / "sample_image_config.json"
        with open(config_file, 'w') as f:
            json.dump(sample_config, f, indent=2)
        
        print(f"📝 Sample config created: {config_file}")
        print(f"")
        print(f"Usage examples:")
        print(f"  Single image: python image_downloader.py --url 'https://example.com/image.jpg' --category hero --name 'hero-banner'")
        print(f"  From config:  python image_downloader.py --config sample_image_config.json")
        print(f"")
        print(f"Available categories: hero, about, programs, membership, gallery, trainers, facilities, blog, general")


if __name__ == "__main__":
    main()