import React, { useState, useEffect, useCallback, useRef } from 'react';

interface Point {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 };
const SPEED = 150;

export const SnakeGame: React.FC<{ onScoreChange: (score: number) => void }> = ({ onScoreChange }) => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  
  const directionRef = useRef<Point>(INITIAL_DIRECTION);
  const nextDirectionRef = useRef<Point>(INITIAL_DIRECTION);
  const gameLoopRef = useRef<number | null>(null);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    directionRef.current = INITIAL_DIRECTION;
    nextDirectionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setIsGameOver(false);
    setIsPaused(true);
    setScore(0);
  };

  const moveSnake = useCallback(() => {
    setSnake(prevSnake => {
      directionRef.current = nextDirectionRef.current;
      const head = prevSnake[0];
      const newHead = {
        x: head.x + directionRef.current.x,
        y: head.y + directionRef.current.y,
      };

      // Check collision with walls
      if (
        newHead.x < 0 || 
        newHead.x >= GRID_SIZE || 
        newHead.y < 0 || 
        newHead.y >= GRID_SIZE
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check if food eaten
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGameOver) return;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (directionRef.current.y === 0) nextDirectionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (directionRef.current.y === 0) nextDirectionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (directionRef.current.x === 0) nextDirectionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (directionRef.current.x === 0) nextDirectionRef.current = { x: 1, y: 0 };
          break;
        case ' ':
          e.preventDefault();
          setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameOver]);

  useEffect(() => {
    if (!isPaused && !isGameOver) {
      gameLoopRef.current = window.setInterval(moveSnake, SPEED);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isPaused, isGameOver, moveSnake]);

  useEffect(() => {
    onScoreChange(score);
  }, [score, onScoreChange]);

  return (
    <div className="relative flex flex-col items-center gap-4">
      <div 
        className="relative grid bg-black border-4 border-[#00ffff] shadow-[0_0_15px_#00ffff,inset_0_0_15px_#00ffff] overflow-hidden"
        style={{ 
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          width: 'min(90vw, 400px)',
          aspectRatio: '1/1',
          backgroundImage: `
            linear-gradient(to right, rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: `${100 / GRID_SIZE}% ${100 / GRID_SIZE}%`
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          const isSnakeHead = snake[0].x === x && snake[0].y === y;
          const isSnakeBody = snake.slice(1).some(s => s.x === x && s.y === y);
          const isFood = food.x === x && food.y === y;

          return (
            <div 
              key={i}
              className={`w-full h-full transition-all duration-75 ${
                isSnakeHead ? 'bg-[#00ffff] shadow-[0_0_10px_#00ffff] z-10' : 
                isSnakeBody ? 'bg-[#00ffff]/40' : 
                isFood ? 'bg-[#ff00ff] shadow-[0_0_10px_#ff00ff] animate-pulse z-10' : ''
              }`}
            />
          );
        })}

        {isPaused && !isGameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-20 backdrop-invert-[0.1]">
            <button 
              onClick={() => setIsPaused(false)}
              className="px-10 py-4 bg-black border-2 border-[#ff00ff] text-[#ff00ff] font-pixel text-2xl shadow-[0_0_20px_#ff00ff] transition-all hover:bg-[#ff00ff] hover:text-black active:scale-95 uppercase tracking-tighter glitch-text"
              data-text="INITIALIZE_LINK"
            >
              INITIALIZE_LINK
            </button>
            <p className="text-[#00ffff] mt-6 text-lg font-pixel tracking-widest animate-pulse">
              [ INPUT_REQUIRED: ARROWS_OR_WASD ]
            </p>
          </div>
        )}

        {isGameOver && (
          <div 
            className="absolute inset-0 flex flex-col items-center justify-center bg-[#ff00ff]/30 z-20 backdrop-blur-sm"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255, 0, 255, 0.2) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 0, 255, 0.2) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          >
            <h2 className="text-6xl font-pixel text-[#ff00ff] mb-2 tracking-tighter glitch-text" data-text="SYSTEM_FAILURE">SYSTEM_FAILURE</h2>
            <p className="text-[#00ffff] font-pixel mb-8 tracking-widest uppercase text-lg">
              DATA_RECOVERED: {score}
            </p>
            <button 
              onClick={resetGame}
              className="px-12 py-3 bg-black border border-[#00ffff] text-[#00ffff] font-pixel text-lg shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all hover:bg-[#00ffff] hover:text-black active:scale-95 uppercase"
            >
              REBOOT_SYSTEM
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
