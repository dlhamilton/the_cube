const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add wasm to asset extensions for expo-sqlite web support
config.resolver.assetExts.push('wasm');

// Block modules that use import.meta for Worker URLs (unsupported by Metro).
// These are transitive deps of @react-three/drei that we don't use at runtime.
const BLOCKED_MODULES = [
  'rhino3dm',
  'three-mesh-bvh/src/workers/GenerateMeshBVHWorker',
  'three-mesh-bvh/src/workers/ParallelMeshBVHWorker',
  'three-mesh-bvh/src/workers/parallelMeshBVH.worker',
];

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (BLOCKED_MODULES.some((blocked) => moduleName.includes(blocked))) {
    return { type: 'empty' };
  }

  // Force zustand ESM (.mjs) files to resolve to CJS (.js) equivalents.
  // The .mjs files contain import.meta which Metro doesn't transform on web.
  const resolved = context.resolveRequest(context, moduleName, platform);
  if (
    resolved &&
    resolved.type === 'sourceFile' &&
    resolved.filePath &&
    resolved.filePath.includes('zustand') &&
    resolved.filePath.endsWith('.mjs')
  ) {
    const cjsPath = resolved.filePath
      .replace('/esm/', '/')
      .replace('.mjs', '.js');
    try {
      require.resolve(cjsPath);
      return { ...resolved, filePath: cjsPath };
    } catch {
      // CJS equivalent not found, keep original
    }
  }

  return resolved;
};

// expo-sqlite on web requires SharedArrayBuffer, which needs these headers.
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
      res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
      return middleware(req, res, next);
    };
  },
};

module.exports = config;
