import { Html, Text, TrackballControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense, useMemo, useState } from 'react';
import * as THREE from 'three';
import { useData } from "../hooks/useData";


interface Word {
  text: string;
  value: number;
}

interface WordProps {
  text: string;
  position: THREE.Vector3;
  value: number;
  maxValue: number;
}

interface WordCloudProps {
  country?: string;
  selectedYear?: number;
}

const Word: React.FC<WordProps> = ({ text, position, value, maxValue }) => {
  const [hovered, setHovered] = useState(false);
  const fontSize = (value / maxValue) * 5 + 1;
  
  const color = useMemo(() => {
    const normalizedValue = value / maxValue;
    if (normalizedValue > 0.8) return hovered ? "#FF6666" : "#FF3333";
    if (normalizedValue > 0.6) return hovered ? "#FF9933" : "#FF6600";
    if (normalizedValue > 0.4) return hovered ? "#66FF66" : "#33CC33";
    if (normalizedValue > 0.2) return hovered ? "#66CCFF" : "#3399FF";
    return hovered ? "#CCECFF" : "#99CCFF";
  }, [value, maxValue, hovered]);

  return (
    <group>
      <Text
        position={position}
        fontSize={fontSize}
        color={color}
        anchorX="center"
        anchorY="middle"
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {text}
      </Text>
      {hovered && (
        <Html position={position}>
          <div className="bg-black bg-opacity-75 text-white p-2 rounded text-sm whitespace-nowrap">
            {text}: {value}
          </div>
        </Html>
      )}
    </group>
  );
};

const WordCloud: React.FC<WordCloudProps> = ({ country, selectedYear }) => {
  const { data } = useData();
  
  const words = useMemo(() => {
    if (!data) return [];
    let topics = new Map<string, number>();
    
    data.filter(entry => {
      return (!country || entry.Country === country) && 
             (!selectedYear || new Date(entry["Account Created At"]).getFullYear() === selectedYear);
    }).forEach(entry => {
      try {
        // Get and sanitize the input
        const rawTopics = (entry["Unique Topics"] || '[]') as unknown as string;
        const formattedTopics = rawTopics.replace(/'/g, '"');
      
        // Parse the topics safely
        let parsedTopics: string[] = [];
        try {
          parsedTopics = JSON.parse(formattedTopics) as string[];
        } catch (parseError) {
          console.warn("Failed to parse JSON, using empty array:", parseError);
          parsedTopics = [];
        }
      
        // Ensure topics map is initialized
        if (!topics) {
          topics = new Map<string, number>();
        }
      
        // Process topics
        parsedTopics.forEach(topic => {
          if (topic?.toLowerCase() !== "unknown") {
            topics.set(topic, (topics.get(topic) ?? 0) + 1);
          }
        });
      } catch (error) {
        console.error("Unexpected error while processing topics:", error);
      }
      
    });

    return Array.from(topics.entries())
      .map(([text, value]) => ({ text, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 50);
  }, [data, country, selectedYear]);

  const maxValue = Math.max(...words.map(w => w.value));

  const positions = words.map((_, i) => {
    const phi = Math.acos(-1 + (2 * i) / words.length);
    const theta = Math.sqrt(words.length * Math.PI) * phi;
    const radius = 30;
    
    return new THREE.Vector3(
      radius * Math.cos(theta) * Math.sin(phi),
      radius * Math.sin(theta) * Math.sin(phi),
      radius * Math.cos(phi)
    );
  });

  return (
    <div className="w-full h-[600px] bg-gray-900 rounded-lg p-4">
      <h2 className="text-xl font-semibold mt-4 mb-4 text-gray-200 font-mono">
        Word Cloud
      </h2>
      <p className="-mt-3 mb-2 text-gray-400 text-sm font-light font-mono tracking-wide">
                This word cloud shows the most common words in GitHub user bios.
              </p>
      <Canvas camera={{ position: [0, 0, 60], fov: 75 }}>
        <ambientLight intensity={1} />
        <Suspense fallback={null}>
          {words.map((word, i) => (
            <Word
              key={word.text}
              text={word.text}
              position={positions[i]}
              value={word.value}
              maxValue={maxValue}
            />
          ))}
        </Suspense>
        <TrackballControls />
      </Canvas>
    </div>
  );
};

export default WordCloud;