import { useEffect, useRef } from "react";

interface Props {
  difficulty: number;
  withPowerUps: boolean;
  victoryCondition: {
    type: "points" | "time";
    value: number;
  };
}

interface Ball {
  x: number;
  y: number;
  radius: number;
  speed: number;
  velocityX: number;
  velocityY: number;
  color: string;
}

interface Paddle {
  width: number;
  height: number;
  x: number;
  y: number;
  color: string;
  score: number;
  speed: number;
}

const PongGame = ({ difficulty }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballRef = useRef<Ball>({} as Ball);
  const playerPaddleRef = useRef<Paddle>({} as Paddle);
  const aiPaddleRef = useRef<Paddle>({} as Paddle);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (context && canvas) {
      ballRef.current = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 5,
        speed: 0.5 * difficulty,
        velocityX: 1,
        velocityY: 1,
        color: "WHITE",
      };

      playerPaddleRef.current = {
        width: 10,
        height: 80,
        x: canvas.width - 20,
        y: canvas.height / 2 - 40,
        color: "WHITE",
        score: 0,
        speed: 0,
      };

      aiPaddleRef.current = {
        width: 10,
        height: 80,
        x: 10,
        y: canvas.height / 2 - 40,
        color: "WHITE",
        score: 0,
        speed: 0,
      };

      const handlePlayerMovementDown = (event: KeyboardEvent) => {
        const moveSpeed = 10;
        if (event.key === "ArrowUp") {
          playerPaddleRef.current.speed = -moveSpeed;
        } else if (event.key === "ArrowDown") {
          playerPaddleRef.current.speed = moveSpeed;
        }
      };

      const handlePlayerMovementUp = (event: KeyboardEvent) => {
        if (event.key === "ArrowUp" || event.key === "ArrowDown") {
          playerPaddleRef.current.speed = 0;
        }
      };

      document.addEventListener("keydown", handlePlayerMovementDown);
      document.addEventListener("keyup", handlePlayerMovementUp);

      const resetBall = () => {
        ballRef.current.x = canvas.width / 2;
        ballRef.current.y = canvas.height / 2;
        const randomHorizontalDirection = Math.random() < 0.5 ? -1 : 1;
        const randomVerticalDirection = Math.random() < 0.5 ? -1 : 1;
        ballRef.current.velocityX =
          randomHorizontalDirection * (2 + Math.random() * difficulty);
        ballRef.current.velocityY =
          randomVerticalDirection * (2 + Math.random() * difficulty);
      };

      const gameLoop = () => {
        ballRef.current.x += ballRef.current.velocityX;
        ballRef.current.y += ballRef.current.velocityY;

        playerPaddleRef.current.y += playerPaddleRef.current.speed;
        // Assurez-vous que le paddle ne sort pas du canvas
        playerPaddleRef.current.y = Math.max(playerPaddleRef.current.y, 0);
        playerPaddleRef.current.y = Math.min(
          playerPaddleRef.current.y,
          canvas.height - playerPaddleRef.current.height
        );

        if (
          ballRef.current.x + ballRef.current.radius < 0 ||
          ballRef.current.x - ballRef.current.radius > canvas.width
        ) {
          resetBall();
        }

        if (
          ballRef.current.y - ballRef.current.radius < 0 ||
          ballRef.current.y + ballRef.current.radius > canvas.height
        ) {
          ballRef.current.velocityY = -ballRef.current.velocityY;
        }

        if (
          ballRef.current.x + ballRef.current.radius >
            playerPaddleRef.current.x &&
          ballRef.current.x - ballRef.current.radius <
            playerPaddleRef.current.x + playerPaddleRef.current.width &&
          ballRef.current.y + ballRef.current.radius >
            playerPaddleRef.current.y &&
          ballRef.current.y - ballRef.current.radius <
            playerPaddleRef.current.y + playerPaddleRef.current.height
        ) {
          const paddleCenter =
            playerPaddleRef.current.y + playerPaddleRef.current.height / 2;
          let distanceFromPaddleCenter = ballRef.current.y - paddleCenter;
          const maxBounceAngle = playerPaddleRef.current.height / 3; // Limiter l'angle de rebond
          distanceFromPaddleCenter = Math.max(
            -maxBounceAngle,
            Math.min(maxBounceAngle, distanceFromPaddleCenter)
          );

          const bounceAngle = distanceFromPaddleCenter / maxBounceAngle;
          const originalSpeed = Math.sqrt(
            ballRef.current.velocityX ** 2 + ballRef.current.velocityY ** 2
          );
          ballRef.current.velocityY = bounceAngle * originalSpeed;
          ballRef.current.velocityX = -ballRef.current.velocityX;

          const newSpeed = Math.sqrt(
            ballRef.current.velocityX ** 2 + ballRef.current.velocityY ** 2
          );
          ballRef.current.velocityX *= originalSpeed / newSpeed;
          ballRef.current.velocityY *= originalSpeed / newSpeed;
        }

        const aiPaddleCenter =
          aiPaddleRef.current.y + aiPaddleRef.current.height / 2;
        if (aiPaddleRef.current.y + 35 < ballRef.current.y) {
          aiPaddleRef.current.y += 1;
        } else if (aiPaddleCenter > ballRef.current.y + 35) {
          aiPaddleRef.current.y -= 1;
        }

        if (
          ballRef.current.x - ballRef.current.radius <
            aiPaddleRef.current.x + aiPaddleRef.current.width &&
          ballRef.current.x + ballRef.current.radius > aiPaddleRef.current.x &&
          ballRef.current.y + ballRef.current.radius > aiPaddleRef.current.y &&
          ballRef.current.y - ballRef.current.radius <
            aiPaddleRef.current.y + aiPaddleRef.current.height
        ) {
          const paddleCenter =
            aiPaddleRef.current.y + aiPaddleRef.current.height / 2;
          let distanceFromPaddleCenter = ballRef.current.y - paddleCenter;
          const maxBounceAngle = aiPaddleRef.current.height / 3; // Limiter l'angle de rebond
          distanceFromPaddleCenter = Math.max(
            -maxBounceAngle,
            Math.min(maxBounceAngle, distanceFromPaddleCenter)
          );

          const bounceAngle = distanceFromPaddleCenter / maxBounceAngle;
          const originalSpeed = Math.sqrt(
            ballRef.current.velocityX ** 2 + ballRef.current.velocityY ** 2
          );
          ballRef.current.velocityY = bounceAngle * originalSpeed;
          ballRef.current.velocityX = -ballRef.current.velocityX;

          const newSpeed = Math.sqrt(
            ballRef.current.velocityX ** 2 + ballRef.current.velocityY ** 2
          );
          ballRef.current.velocityX *= originalSpeed / newSpeed;
          ballRef.current.velocityY *= originalSpeed / newSpeed;
        }

        context.clearRect(0, 0, canvas.width, canvas.height);
        drawPaddle(context, playerPaddleRef.current);
        drawPaddle(context, aiPaddleRef.current);
        drawBall(context, ballRef.current);
        drawScore(context, canvas);

        requestAnimationFrame(gameLoop);
      };

      gameLoop();

      return () => {
        document.removeEventListener("keydown", handlePlayerMovementDown);
        document.removeEventListener("keyup", handlePlayerMovementUp);
      };
    }
  }, [difficulty]);

  const drawPaddle = (context: CanvasRenderingContext2D, paddle: Paddle) => {
    context.fillStyle = paddle.color;
    context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
  };

  const drawBall = (context: CanvasRenderingContext2D, ball: Ball) => {
    context.fillStyle = ball.color;
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, true);
    context.closePath();
    context.fill();
  };

  const drawScore = (
    context: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    context.font = "30px Arial";
    context.fillStyle = "WHITE";
    context.fillText(`Player: ${playerPaddleRef.current.score}`, 50, 50);
    context.fillText(
      `AI: ${aiPaddleRef.current.score}`,
      canvas.width - 150,
      50
    );
  };

  return (
    <canvas
      ref={canvasRef}
      width="1000"
      height="600"
      style={{
        display: "block",
        maxWidth: "1200px",
        border: "1px dashed white",
      }}
    />
  );
};

export default PongGame;
