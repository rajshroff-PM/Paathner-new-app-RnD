import React, { useRef, useEffect, useState } from 'react';
import { X, Trophy, Play, RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Medal, Coins } from 'lucide-react';

interface NavigationGameProps {
  onClose: () => void;
  onScoreSubmit: (score: number) => void;
}

const NavigationGame: React.FC<NavigationGameProps> = ({ onClose, onScoreSubmit }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  
  // Game state refs to avoid closure staleness in animation loop
  const playerPos = useRef({ x: 50, y: 50 });
  const targetPos = useRef({ x: 200, y: 200 });
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  
  const keysPressed = useRef<Record<string, boolean>>({});

  const CANVAS_SIZE = 400;
  const PLAYER_SIZE = 20;
  const TARGET_SIZE = 25;
  const SPEED = 3;

  useEffect(() => {
    const saved = localStorage.getItem('mallDashHighScore');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { keysPressed.current[e.key] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { keysPressed.current[e.key] = false; };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const spawnTarget = () => {
    targetPos.current = {
      x: Math.random() * (CANVAS_SIZE - TARGET_SIZE),
      y: Math.random() * (CANVAS_SIZE - TARGET_SIZE)
    };
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameState('playing');
    playerPos.current = { x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 };
    spawnTarget();
    lastTimeRef.current = Date.now();
    requestRef.current = requestAnimationFrame(gameLoop);
  };

  const update = () => {
    if (gameState !== 'playing') return;

    if (keysPressed.current['ArrowUp'] || keysPressed.current['w']) playerPos.current.y = Math.max(0, playerPos.current.y - SPEED);
    if (keysPressed.current['ArrowDown'] || keysPressed.current['s']) playerPos.current.y = Math.min(CANVAS_SIZE - PLAYER_SIZE, playerPos.current.y + SPEED);
    if (keysPressed.current['ArrowLeft'] || keysPressed.current['a']) playerPos.current.x = Math.max(0, playerPos.current.x - SPEED);
    if (keysPressed.current['ArrowRight'] || keysPressed.current['d']) playerPos.current.x = Math.min(CANVAS_SIZE - PLAYER_SIZE, playerPos.current.x + SPEED);

    const dx = playerPos.current.x - targetPos.current.x;
    const dy = playerPos.current.y - targetPos.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < PLAYER_SIZE + TARGET_SIZE - 10) {
      setScore(prev => prev + 10);
      spawnTarget();
    }
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < CANVAS_SIZE; i += 40) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, CANVAS_SIZE); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(CANVAS_SIZE, i); ctx.stroke();
    }

    // Draw Target
    ctx.fillStyle = '#F59E0B';
    ctx.shadowColor = '#F59E0B';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(targetPos.current.x + TARGET_SIZE/2, targetPos.current.y + TARGET_SIZE/2, TARGET_SIZE/2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw Player (Updated to Primary Blue #066CE4)
    ctx.fillStyle = '#066CE4';
    ctx.beginPath();
    ctx.arc(playerPos.current.x + PLAYER_SIZE/2, playerPos.current.y + PLAYER_SIZE/2, PLAYER_SIZE/2, 0, Math.PI * 2);
    ctx.fill();
    
    // Player glow
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(6, 108, 228, 0.5)'; // Blue rgba
    ctx.lineWidth = 2;
    ctx.arc(playerPos.current.x + PLAYER_SIZE/2, playerPos.current.y + PLAYER_SIZE/2, PLAYER_SIZE/2 + 5, 0, Math.PI * 2);
    ctx.stroke();
  };

  const gameLoop = () => {
    if (gameState !== 'playing') return;

    const now = Date.now();
    if (now - lastTimeRef.current >= 1000) {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleGameOver();
          return 0;
        }
        return prev - 1;
      });
      lastTimeRef.current = now;
    }

    update();

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) draw(ctx);
    }

    if (gameState === 'playing') {
      requestRef.current = requestAnimationFrame(gameLoop);
    }
  };

  const handleGameOver = () => {
    setGameState('gameover');
    // Submit score to main app (e.g., 10% of score becomes coins)
    const pointsEarned = Math.floor(score * 0.1);
    if (pointsEarned > 0) {
        onScoreSubmit(pointsEarned);
    }
    
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('mallDashHighScore', score.toString());
    }
  };

  useEffect(() => {
    if (gameState === 'playing') {
      requestRef.current = requestAnimationFrame(gameLoop);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameState]);

  useEffect(() => {
    if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('mallDashHighScore', score.toString());
    }
  }, [score]);

  const handleMobileMove = (dir: string) => { keysPressed.current[dir] = true; };
  const handleMobileStop = (dir: string) => { keysPressed.current[dir] = false; };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl max-w-lg w-full flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-2">
            <Trophy className="text-yellow-400" size={20} />
            <span className="text-white font-bold">Mall Dash</span>
          </div>
          <div className="flex items-center gap-4 text-sm font-mono">
             <div className="flex items-center gap-1 text-gray-400">
                <Medal size={14} className="text-yellow-500" />
                {highScore}
             </div>
             <div className="text-white">Score: <span className="text-primary text-lg">{score}</span></div>
             <div className={`${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>Time: {timeLeft}s</div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <X size={24} />
          </button>
        </div>

        {/* Game Area */}
        <div className="relative w-full aspect-square bg-gray-950 flex items-center justify-center overflow-hidden">
          <canvas 
            ref={canvasRef} 
            width={CANVAS_SIZE} 
            height={CANVAS_SIZE} 
            className="w-full h-full object-contain"
          />

          {gameState === 'start' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm text-center p-6">
              <h2 className="text-3xl font-bold text-white mb-2">Ready to Dash?</h2>
              <p className="text-gray-300 mb-6">Collect targets to earn rewards points!</p>
              <button 
                onClick={startGame}
                className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-full font-bold text-lg transition flex items-center gap-2 shadow-lg shadow-primary/30"
              >
                <Play size={20} /> Start Game
              </button>
            </div>
          )}

          {gameState === 'gameover' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm text-center p-6">
              <h2 className="text-4xl font-bold text-white mb-2">Time's Up!</h2>
              <div className="text-6xl font-bold text-primary mb-2 text-glow">{score}</div>
              
              <div className="bg-white/10 rounded-xl p-3 mb-6 flex items-center gap-2 animate-pulse">
                 <Coins className="text-yellow-400" />
                 <span className="text-white font-bold">+{Math.floor(score * 0.1)} Points Earned</span>
              </div>

              <button 
                onClick={startGame}
                className="bg-white text-black hover:bg-gray-200 px-8 py-3 rounded-full font-bold text-lg transition flex items-center gap-2"
              >
                <RotateCcw size={20} /> Play Again
              </button>
            </div>
          )}
        </div>

        {/* Mobile Controls */}
        <div className="p-4 bg-white/5 border-t border-white/10 md:hidden grid grid-cols-3 gap-2 justify-items-center">
           <div></div>
           <button 
             className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center active:bg-primary active:scale-95 transition"
             onMouseDown={() => handleMobileMove('ArrowUp')} onMouseUp={() => handleMobileStop('ArrowUp')}
             onTouchStart={() => handleMobileMove('ArrowUp')} onTouchEnd={() => handleMobileStop('ArrowUp')}
           >
             <ArrowUp className="text-white" />
           </button>
           <div></div>
           <button 
             className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center active:bg-primary active:scale-95 transition"
             onMouseDown={() => handleMobileMove('ArrowLeft')} onMouseUp={() => handleMobileStop('ArrowLeft')}
             onTouchStart={() => handleMobileMove('ArrowLeft')} onTouchEnd={() => handleMobileStop('ArrowLeft')}
           >
             <ArrowLeft className="text-white" />
           </button>
           <button 
             className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center active:bg-primary active:scale-95 transition"
             onMouseDown={() => handleMobileMove('ArrowDown')} onMouseUp={() => handleMobileStop('ArrowDown')}
             onTouchStart={() => handleMobileMove('ArrowDown')} onTouchEnd={() => handleMobileStop('ArrowDown')}
           >
             <ArrowDown className="text-white" />
           </button>
           <button 
             className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center active:bg-primary active:scale-95 transition"
             onMouseDown={() => handleMobileMove('ArrowRight')} onMouseUp={() => handleMobileStop('ArrowRight')}
             onTouchStart={() => handleMobileMove('ArrowRight')} onTouchEnd={() => handleMobileStop('ArrowRight')}
           >
             <ArrowRight className="text-white" />
           </button>
        </div>
      </div>
    </div>
  );
};

export default NavigationGame;