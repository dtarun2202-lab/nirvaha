import { useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'

function Hands() {
  const { scene } = useGLTF('/globe_hands3.glb')
  const ref = useRef()

  return (
    <primitive
      ref={ref}
      object={scene}
      scale={0.028}
      position={[0, 0, 0]}
      rotation={[0, 0, 0]}
    />
  )
}

export default function HandsOverlay() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        background: 'transparent',
      }}
      gl={{ alpha: true }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, -5, 2]} color="#00FF9C" intensity={0.6} />
      <Suspense fallback={null}>
        <Hands />
      </Suspense>
    </Canvas>
  )
}

useGLTF.preload('/globe_hands3.glb')
