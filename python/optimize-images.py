#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
이미지 최적화 스크립트 (Python)
필요: pip install Pillow
"""

import os
import sys
from pathlib import Path

def optimize_images(source_folder, dest_folder, max_width, quality):
    """이미지 리사이즈 및 최적화"""

    try:
        from PIL import Image
    except ImportError:
        print("ERROR: Pillow library not found")
        print("Install: pip install Pillow")
        return 0

    # 대상 폴더 생성
    dest_path = Path(dest_folder)
    dest_path.mkdir(parents=True, exist_ok=True)
    print(f"Created folder: {dest_folder}")

    # 지원하는 이미지 형식
    extensions = ['.jpg', '.jpeg', '.png']

    count = 0
    total_original = 0
    total_new = 0

    source_path = Path(source_folder)

    if not source_path.exists():
        print(f"WARNING: Folder not found: {source_folder}")
        return 0

    # 파일 목록 가져오기
    files = [f for f in source_path.glob('*') if f.suffix.lower() in extensions]

    if not files:
        print(f"WARNING: No images found in {source_folder}")
        return 0

    print(f"Found {len(files)} images to process")
    print("")

    for file_path in files:
        try:
            print(f"Processing: {file_path.name}", end=" ... ")

            # 이미지 열기
            img = Image.open(file_path)

            # 원본 크기
            original_size = os.path.getsize(file_path) / 1024  # KB
            total_original += original_size

            # RGBA를 RGB로 변환 (JPEG 저장을 위해)
            if img.mode in ('RGBA', 'LA', 'P'):
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                if img.mode == 'RGBA':
                    background.paste(img, mask=img.split()[-1])
                else:
                    background.paste(img)
                img = background

            # 리사이즈 (비율 유지)
            if img.width > max_width:
                ratio = max_width / img.width
                new_height = int(img.height * ratio)
                img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
                print(f"Resized to {img.width}x{img.height}", end=" ... ")

            # 저장 경로
            output_path = dest_path / file_path.name

            # 파일 형식 결정
            if file_path.suffix.lower() == '.png':
                img.save(output_path, 'PNG', optimize=True, quality=quality)
            else:
                output_path = output_path.with_suffix('.jpg')
                img.save(output_path, 'JPEG', quality=quality, optimize=True)

            # 새 크기
            new_size = os.path.getsize(output_path) / 1024
            total_new += new_size
            saved_percent = ((original_size - new_size) / original_size) * 100

            print(f"OK ({original_size:.1f}KB -> {new_size:.1f}KB, {saved_percent:.0f}% saved)")
            count += 1

        except Exception as e:
            print(f"FAILED: {e}")

    print("")
    if count > 0:
        total_saved = ((total_original - total_new) / total_original) * 100
        print(f"TOTAL: {total_original:.1f}KB -> {total_new:.1f}KB ({total_saved:.0f}% saved)")
        print(f"Processed {count} images successfully")
    print("")

    return count

def main():
    print("=" * 60)
    print("Sewon Printing - Image Optimization Script")
    print("=" * 60)
    print("")

    # PIL 설치 확인
    try:
        from PIL import Image
        print("[OK] Pillow library found")
    except ImportError:
        print("[ERROR] Pillow library not installed")
        print("Install command: pip install Pillow")
        print("")
        sys.exit(1)

    # 프로젝트 루트로 이동
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    os.chdir(project_root)

    print(f"[OK] Working directory: {project_root}")
    print("")

    # 포트폴리오 이미지 최적화
    print(">>> 1. Portfolio Images")
    print("-" * 60)
    portfolio_count = optimize_images(
        source_folder="images/portfolio/pc",
        dest_folder="images/portfolio/mobile",
        max_width=800,
        quality=75
    )

    # 홍보 이미지 최적화
    print(">>> 2. Promotional Images")
    print("-" * 60)
    promotional_count = optimize_images(
        source_folder="images/promotional/pc",
        dest_folder="images/promotional/mobile",
        max_width=768,
        quality=80
    )

    print("=" * 60)
    print("Optimization Complete!")
    print("=" * 60)
    print("")
    print("Next steps:")
    print("1. Check images/portfolio/mobile/ folder")
    print("2. Check images/promotional/mobile/ folder")
    print("3. Test image quality")
    print("4. Commit changes to Git")
    print("")

    if portfolio_count == 0 and promotional_count == 0:
        print("WARNING: No images were processed!")
        print("Make sure to put images in:")
        print("  - images/portfolio/pc/")
        print("  - images/promotional/pc/")
        print("")

if __name__ == "__main__":
    main()
