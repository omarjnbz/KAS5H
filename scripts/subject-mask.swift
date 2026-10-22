/*
 * Subject masks for the hero stills. The hero sets the alias name behind his
 * head: the photo, then the name, then the same photo again through this mask.
 * Writes a white PNG whose alpha is the subject (macOS Vision, on-device), then
 * shrink it to WebP for the site:
 *
 *   swift scripts/subject-mask.swift public/promo/p21.jpg /tmp/p21.png
 *   cwebp -lossless /tmp/p21.png -o public/promo/masks/p21.webp
 *
 * Needs macOS 14+. Add the still to `studio` in src/content/artists.js.
 */
import Foundation
import Vision
import CoreImage

let args = CommandLine.arguments
guard args.count == 3 else { fatalError("usage: subject-mask.swift <photo> <out.png>") }
let input = URL(fileURLWithPath: args[1]), output = URL(fileURLWithPath: args[2])

let handler = VNImageRequestHandler(url: input)
let request = VNGenerateForegroundInstanceMaskRequest()
try handler.perform([request])
guard let found = request.results?.first else { fatalError("no subject found in \(args[1])") }

// Full size, so the mask lines up with the photo pixel for pixel.
let buffer = try found.generateScaledMaskForImage(forInstances: found.allInstances, from: handler)
let alpha = CIImage(cvPixelBuffer: buffer).applyingFilter("CIMaskToAlpha")
try CIContext().writePNGRepresentation(of: alpha, to: output, format: .RGBA8, colorSpace: CGColorSpace(name: CGColorSpace.sRGB)!)
print("\(args[2]) \(Int(alpha.extent.width))×\(Int(alpha.extent.height))")
