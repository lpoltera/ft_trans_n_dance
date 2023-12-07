import { useEffect, useRef, useState } from "react";
import { useGameContext } from "../../contexts/GameContext";
import { Ball, Paddle } from "../../models/Game";

const PongGame = () => {
	const { gameDetails } = useGameContext();
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const ballRef = useRef<Ball>({
		x: 0,
		y: 0,
		radius: 5,
		speed: 1,
		velocityX: 0,
		velocityY: 0,
		color: "WHITE",
	});
	const player1PaddleRef = useRef<Paddle>({
		width: 10,
		height: 50,
		x: 100,
		y: 0,
		color: "WHITE",
		score: 0,
		speed: 0,
		acceleration: 0.1,
	});
	const player2PaddleRef = useRef<Paddle>({
		width: 10,
		height: 50,
		x: 0,
		y: 0,
		color: "WHITE",
		score: 0,
		speed: 0,
		acceleration: 0.1,
	});
	const [gameFinished, setGameFinished] = useState(false); // TODO: Use this to display winner
	const [displayedTimer, setDisplayedTimer] = useState(0);
	const isPaused = useRef(true);
	const setIsPaused = (value: boolean) => {
		isPaused.current = value;
	};
	const timer = useRef(0);
	const setTimer = (value: number) => {
		timer.current = value;
	};

	if (gameDetails?.withPowerUps) {
		console.log("Power-ups are not implemented yet");
	} // TODO: Implement power-ups

	useEffect(() => {
		const canvas = canvasRef.current;
		const context = canvas?.getContext("2d");
		const maxSpeed = 2 * (gameDetails?.difficulty || 1);
		const acceleration = 0.1 * (gameDetails?.difficulty || 1);
		const moveSpeed = 5;

		if (context && canvas) {
			player2PaddleRef.current.x = canvas.width - 100 - 10;
			ballRef.current.x = canvas.width / 2;
			ballRef.current.y = canvas.height / 2;
			ballRef.current.speed = 1 + (gameDetails?.difficulty || 1);
			ballRef.current.velocityX =
				ballRef.current.speed * (Math.random() < 0.5 ? -1 : 1);
			ballRef.current.velocityY =
				ballRef.current.speed * (Math.random() < 0.5 ? -1 : 1);

			player1PaddleRef.current.y =
				canvas.height / 2 - player1PaddleRef.current.height / 2;
			player2PaddleRef.current.y =
				canvas.height / 2 - player2PaddleRef.current.height / 2;

			const handleMovement = (event: KeyboardEvent) => {
				if (event.key === "ArrowUp") {
					player2PaddleRef.current.acceleration = -acceleration;
				} else if (event.key === "ArrowDown") {
					player2PaddleRef.current.acceleration = acceleration;
				} else if (event.key === "w") {
					player1PaddleRef.current.acceleration = -acceleration;
				} else if (event.key === "s") {
					player1PaddleRef.current.acceleration = acceleration;
				} else if (event.key === " ") {
					setIsPaused(!isPaused.current);
				}
			};

			const handleMovementUp = (event: KeyboardEvent) => {
				if (event.key === "ArrowUp" || event.key === "ArrowDown") {
					player2PaddleRef.current.acceleration = 0;
				} else if (event.key === "w" || event.key === "s") {
					player1PaddleRef.current.acceleration = 0;
				}
			};

			const endGame = () => {
				document.removeEventListener("keydown", handleMovement);
				document.removeEventListener("keyup", handleMovementUp);
				clearInterval(interval);
				setGameFinished(true);
				ballRef.current.velocityX = 0;
				ballRef.current.velocityY = 0;
				ballRef.current.color = "black";
				// TODO: Display winner
				return;
			};

			document.addEventListener("keydown", handleMovement);
			document.addEventListener("keyup", handleMovementUp);

			const interval = setInterval(() => {
				if (!isPaused.current && !gameFinished) {
					setTimer(timer.current + 1);
					setDisplayedTimer(timer.current);
				}
			}, 1000);

			const checkVictoryCondition = () => {
				if (
					gameDetails?.victoryCondition.type === "time" &&
					timer.current >= (gameDetails?.victoryCondition.value || 0)
				) {
					clearInterval(interval);
					endGame();
				} else if (
					gameDetails?.victoryCondition.type === "1972" &&
					(player1PaddleRef.current.score >= 11 ||
						player2PaddleRef.current.score >= 11) &&
					Math.abs(
						player1PaddleRef.current.score - player2PaddleRef.current.score
					) >= 2
				) {
					clearInterval(interval);
					endGame();
				} else if (
					gameDetails?.victoryCondition.type === "points" &&
					(player1PaddleRef.current.score >=
						(gameDetails?.victoryCondition.value || 1) ||
						player2PaddleRef.current.score >=
						(gameDetails?.victoryCondition.value || 1))
				) {
					clearInterval(interval);
					endGame();
				}
			};

			const checkPaddleCollision = (paddle: Paddle, ball: Ball) => {
				if (
					ball.x + ball.radius > paddle.x &&
					ball.x - ball.radius < paddle.x + paddle.width &&
					ball.y + ball.radius > paddle.y &&
					ball.y - ball.radius < paddle.y + paddle.height
				) {
					const paddleCenter = paddle.y + paddle.height / 2;
					const distanceFromPaddleCenter = ball.y - paddleCenter;
					const bounceAngle =
						(distanceFromPaddleCenter / (paddle.height / 2)) * (Math.PI / 4); // The bounce angle never exceeds 45 degrees

					// Recalculate velocityX and velocityY to maintain constant speed
					ball.velocityX =
						-Math.sign(ball.velocityX) * ball.speed * Math.cos(bounceAngle);
					ball.velocityY = ball.speed * Math.sin(bounceAngle);

					// Increase ball speed after each hit
					ball.speed += 0.1;
				}
			};

			const resetBall = (playerScored: number) => {
				ballRef.current.y = canvas.height / 2;
				const angle = (Math.random() * Math.PI) / 4 - Math.PI / 8; // Random angle between -22.5 and 22.5 degrees

				// Serve the ball from the middle of the player's "field" who scored
				ballRef.current.x =
					playerScored === 1 ? canvas.width / 4 : (canvas.width / 4) * 3;

				const velocityX =
					playerScored === 1 ? Math.cos(angle) : -Math.cos(angle); // Positive for player 1, negative for player 2
				const velocityY = Math.sin(angle);
				const magnitude = Math.sqrt(
					velocityX * velocityX + velocityY * velocityY
				);

				// Normalize the velocity vector and scale it by the desired speed
				ballRef.current.velocityX =
					(velocityX / magnitude) * ballRef.current.speed;
				ballRef.current.velocityY =
					(velocityY / magnitude) * ballRef.current.speed;
			};

			const aiPlayer = () => {
				if (!gameDetails?.player2 && !gameFinished) {
					// The speed at which the AI paddle moves
					const aiSpeed = 0 + (gameDetails?.difficulty || 1); // Adjust as needed

					// The target y-position for the AI paddle
					const targetY =
						ballRef.current.y - player2PaddleRef.current.height / 2;

					// Interpolate the paddle's current position towards the target position at the AI speed
					if (targetY < player2PaddleRef.current.y) {
						player2PaddleRef.current.y = Math.max(
							targetY,
							player2PaddleRef.current.y - aiSpeed
						);
					} else {
						player2PaddleRef.current.y = Math.min(
							targetY,
							player2PaddleRef.current.y + aiSpeed
						);
					}
				}
			};

			const gameLoop = () => {
				if (!canvasRef.current) {
					return;
				}
				const context = canvas.getContext("2d");
				if (!context) {
					return;
				}
				if (isPaused.current) {
					context.clearRect(0, 0, canvas.width, canvas.height);
					drawPauseScreen(context, canvas);
				} else if (gameFinished) {
					const winner =
						player1PaddleRef.current.score > player2PaddleRef.current.score
							? gameDetails?.player1?.username
							: gameDetails?.player2?.username;
					context.clearRect(0, 0, canvas.width, canvas.height);
					drawScore(context, canvas);
					drawEndScreen(context, canvas, winner || "AI");
				} else {
					ballRef.current.x += ballRef.current.velocityX;
					ballRef.current.y += ballRef.current.velocityY;

					// In your game loop, update the paddle's speed based on its acceleration
					player1PaddleRef.current.speed +=
						player1PaddleRef.current.acceleration;
					player2PaddleRef.current.speed +=
						player2PaddleRef.current.acceleration;

					// Limit the paddle's speed to the moveSpeed
					player1PaddleRef.current.speed = Math.max(
						Math.min(player1PaddleRef.current.speed, moveSpeed),
						-moveSpeed
					);
					player2PaddleRef.current.speed = Math.max(
						Math.min(player2PaddleRef.current.speed, moveSpeed),
						-moveSpeed
					);

					player1PaddleRef.current.y += player1PaddleRef.current.speed;
					player2PaddleRef.current.y += player2PaddleRef.current.speed;

					player1PaddleRef.current.y = Math.max(
						30,
						Math.min(
							canvas.height - player1PaddleRef.current.height - 30,
							player1PaddleRef.current.y
						)
					);

					player2PaddleRef.current.y = Math.max(
						30,
						Math.min(
							canvas.height - player2PaddleRef.current.height - 30,
							player2PaddleRef.current.y
						)
					);

					if (
						ballRef.current.y - ballRef.current.radius < 0 ||
						ballRef.current.y + ballRef.current.radius > canvas.height
					) {
						ballRef.current.velocityY = -ballRef.current.velocityY;
					}

					if (ballRef.current.x + ballRef.current.radius < 0) {
						player2PaddleRef.current.score += 1;
						resetBall(2);
					} else if (
						ballRef.current.x - ballRef.current.radius >
						canvas.width
					) {
						player1PaddleRef.current.score += 1;
						resetBall(1);
					}

					checkPaddleCollision(player1PaddleRef.current, ballRef.current);
					checkPaddleCollision(player2PaddleRef.current, ballRef.current);

					// Limit the ball's speed to the maximum speed
					const speed = Math.sqrt(
						ballRef.current.velocityX ** 2 + ballRef.current.velocityY ** 2
					);
					if (speed > maxSpeed) {
						ballRef.current.velocityX *= maxSpeed / speed;
						ballRef.current.velocityY *= maxSpeed / speed;
					}

					context.clearRect(0, 0, canvas.width, canvas.height);
					drawPaddle(context, player1PaddleRef.current);
					drawPaddle(context, player2PaddleRef.current);
					drawBall(context, ballRef.current);
					drawDashedLine(context, canvas);
					drawScore(context, canvas);

					checkVictoryCondition();

					aiPlayer();
				}
				requestAnimationFrame(gameLoop);
			};

			gameLoop();

			return () => {
				document.removeEventListener("keydown", handleMovement);
				document.removeEventListener("keyup", handleMovementUp);
				clearInterval(interval);
			};
		}
	}, [gameDetails, isPaused, gameFinished, setGameFinished]);

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

	const drawDashedLine = (
		context: CanvasRenderingContext2D,
		canvas: HTMLCanvasElement
	) => {
		context.beginPath();
		context.setLineDash([15, 15]);
		context.moveTo(canvas.width / 2, 0);
		context.lineTo(canvas.width / 2, canvas.height);
		context.strokeStyle = "WHITE";
		context.stroke();
	};

	const drawScore = (
		context: CanvasRenderingContext2D,
		canvas: HTMLCanvasElement
	) => {
		context.font = "80px 'courier new'";
		context.fillStyle = "WHITE";

		const player1Score = `${player1PaddleRef.current.score}`;
		const player2Score = `${player2PaddleRef.current.score}`;

		context.textAlign = "end";
		context.fillText(player1Score, canvas.width / 2 - 50, 100);

		context.textAlign = "start";
		context.fillText(player2Score, canvas.width / 2 + 50, 100);
	};

	const drawPauseScreen = (
		context: CanvasRenderingContext2D,
		canvas: HTMLCanvasElement
	) => {
		const message = "Press space to start";
		const padding = 20;
		const boxWidth = context.measureText(message).width + 2 * padding;
		const boxHeight = 100; // Adjust as needed

		const x = (canvas.width - boxWidth) / 2;
		const y = (canvas.height - boxHeight) / 2;

		// Draw the black background
		context.fillStyle = "black";
		context.fillRect(x, y, boxWidth, boxHeight);

		// Draw the white border
		context.setLineDash([]);
		context.strokeStyle = "white";
		context.lineWidth = 2;
		context.strokeRect(x, y, boxWidth, boxHeight);

		// Draw the text
		context.fillStyle = "white";
		context.font = "30px Arial"; // Adjust as needed
		context.textAlign = "center";
		context.textBaseline = "middle";
		context.fillText(message, canvas.width / 2, canvas.height / 2);
	};

	const drawEndScreen = (
		context: CanvasRenderingContext2D,
		canvas: HTMLCanvasElement,
		winnerName: string
	) => {
		const message = `${winnerName} wins!`;
		const padding = 20;
		const boxWidth = context.measureText(message).width + 2 * padding;
		const boxHeight = 100; // Adjust as needed

		const x = (canvas.width - boxWidth) / 2;
		const y = (canvas.height - boxHeight) / 2;

		// Draw the black background
		context.fillStyle = "black";
		context.fillRect(x, y, boxWidth, boxHeight);

		// Draw the white border
		context.setLineDash([]);
		context.strokeStyle = "white";
		context.lineWidth = 2;
		context.strokeRect(x, y, boxWidth, boxHeight);

		// Draw the text
		context.fillStyle = "white";
		context.font = "30px Arial"; // Adjust as needed
		context.textAlign = "center";
		context.textBaseline = "middle";
		context.fillText(message, canvas.width / 2, canvas.height / 2);
	};

	return (
		<div className="flex flex-col gap-2 items-center">
			<div>
				<canvas
					ref={canvasRef}
					width="1000"
					height="750"
					style={{
						display: "block",
						maxWidth: "1200px",
						backgroundColor: "black",
					}}
					className="border-cyan-950 border"
				/>
				<div className="flex flex-row justify-between w-full mt-4">
					<div style={{ textAlign: "left" }}>
						{gameDetails?.player1?.username}
					</div>
					<div style={{ textAlign: "center" }}>
						Temps écoulé: {displayedTimer} secondes
					</div>
					<div style={{ textAlign: "right" }}>
						{gameDetails?.player2 ? gameDetails?.player2?.username : "Alex(ai)"}
					</div>
				</div>
			</div>
		</div>
	);
};

export default PongGame;
