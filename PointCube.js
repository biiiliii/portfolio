import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';

function Points({ mouse }) {
    const ref = useRef();

    const vertices = useMemo(() => {
        const verticesArray = new Float32Array(6000); 
        for (let i = 0; i < verticesArray.length; i++) {
            verticesArray[i] = (Math.random() - 0.5) * 7.5;
        }
        return verticesArray;
    }, []);

    useFrame((state, delta) => {
        if (ref.current) {
            // Animate rotation
            ref.current.rotation.x += delta / 15;
            ref.current.rotation.y += delta / 20;

            // Move to mouse position (projected to z=0)
            ref.current.position.x = mouse.current.x;
            ref.current.position.y = mouse.current.y;
        }
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    array={vertices}
                    count={vertices.length / 3}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial 
                size={0.006} 
                color="#fff" 
                sizeAttenuation={true}
                transparent 
                opacity={0.8}
            />
        </points>
    );
}

export default function PointCube() {
    const mouse = useRef({ x: 0, y: 0 });

    // Update mouse position in NDC (-1 to 1)
    useEffect(() => {
        const handleMouseMove = (event) => {
            mouse.current.x = ((event.clientX / window.innerWidth) * 2 - 1) * .2;
            mouse.current.y = -((event.clientY / window.innerHeight) * 2 - 1) * .2;
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <Canvas camera={{ position: [0, 0, 3] }} style={{ height: '100vh', width: '100vw' }}>
            <Points mouse={mouse} />
        </Canvas>
    );
}