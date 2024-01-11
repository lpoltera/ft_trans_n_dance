import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../Components/PageLayout";

interface Props {
	statusCode: string;
}

const ErrorPage = ({ statusCode }: Props) => {
	const navigate = useNavigate();
	useEffect(() => {
		var canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
		if (!canvas) {
			return;
		}

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		var ctx = canvas.getContext("2d");
		if (!ctx) {
			return;
		}

		var ballRadius = 15;
		var x = canvas.width / 2 + 10;
		var y = canvas.height / 2 + 10;
		var dx = 3;
		var dy = -3;

		var x2 = canvas.width / 2;
		var y2 = canvas.height / 2;
		var dx2 = -3;
		var dy2 = 3;

		let angle = 0;

		function drawBall() {
			if (!ctx) {
				return;
			}
			ctx.save(); // Save the current state of the canvas
			ctx.translate(x, y); // Move the canvas to the point where you want to draw the text
			ctx.rotate(angle); // Rotate the canvas
			ctx.beginPath();
			ctx.font = "bold 40px Arial";
			ctx.fillStyle = "#f67539";
			ctx.fillText("?", 0, 0); // Draw the text at the coordinates (0, 0)
			ctx.closePath();
			ctx.restore(); // Restore the canvas to its original state
			angle += 0.05; // Increase the angle for the next frame
		}

		function drawBall2() {
			if (!ctx) {
				return;
			}
			ctx.save(); // Save the current state of the canvas
			ctx.translate(x2, y2); // Move the canvas to the point where you want to draw the text
			ctx.rotate(angle); // Rotate the canvas
			ctx.beginPath();
			ctx.font = "bold 40px Arial";
			ctx.fillStyle = "#0e7490";
			ctx.fillText("?", 0, 0); // Draw the text at the coordinates (0, 0)
			ctx.closePath();
			ctx.restore(); // Restore the canvas to its original state
			angle += 0.05; // Increase the angle for the next frame
		}

		var elements = Array.from(document.querySelectorAll("button, h1, h2"));
		var elementsCoords = elements.map((element) => {
			var rect = element.getBoundingClientRect();
			return {
				x: rect.left - canvas.offsetLeft,
				y: rect.top - canvas.offsetTop,
				width: rect.width,
				height: rect.height,
			};
		});

		var borders = Array.from(document.querySelectorAll("main"));
		var bordersCoords = borders.map((border) => {
			var rect = border.getBoundingClientRect();
			return {
				x: rect.left - canvas.offsetLeft,
				y: rect.top - canvas.offsetTop,
				width: rect.width,
				height: rect.height,
			};
		});

		function draw() {
			ctx?.clearRect(0, 0, canvas.width, canvas.height);
			drawBall();
			drawBall2();

			elementsCoords.forEach((coords) => {
				if (
					x <= coords.x &&
					x + dx > coords.x &&
					y + dy > coords.y &&
					y + dy < coords.y + coords.height
				) {
					dx = -dx;
				} else if (
					x >= coords.x + coords.width &&
					x + dx < coords.x + coords.width &&
					y + dy > coords.y &&
					y + dy < coords.y + coords.height
				) {
					dx = -dx;
				}
				if (
					y <= coords.y &&
					y + dy > coords.y &&
					x + dx > coords.x &&
					x + dx < coords.x + coords.width
				) {
					dy = -dy;
				}
				if (
					y >= coords.y + coords.height &&
					y + dy < coords.y + coords.height &&
					x + dx > coords.x &&
					x + dx < coords.x + coords.width
				) {
					dy = -dy;
				}
				if (
					x2 <= coords.x &&
					x2 + dx2 > coords.x &&
					y2 + dy2 > coords.y &&
					y2 + dy2 < coords.y + coords.height
				) {
					dx2 = -dx2;
				} else if (
					x2 >= coords.x + coords.width &&
					x2 + dx2 < coords.x + coords.width &&
					y2 + dy2 > coords.y &&
					y2 + dy2 < coords.y + coords.height
				) {
					dx2 = -dx2;
				} else if (
					y2 <= coords.y &&
					y2 + dy2 > coords.y &&
					x2 + dx2 > coords.x &&
					x2 + dx2 < coords.x + coords.width
				) {
					dy2 = -dy2;
				} else if (
					y2 >= coords.y + coords.height &&
					y2 + dy2 < coords.y + coords.height &&
					x2 + dx2 > coords.x &&
					x2 + dx2 < coords.x + coords.width
				) {
					dy2 = -dy2;
				}
			});

			bordersCoords.forEach((coords) => {
				if (x + dx > coords.x + coords.width - ballRadius || x + dx < coords.x) {
					dx = -dx;
				}
				if (y + dy > coords.y + coords.height - ballRadius || y + dy < coords.y) {
					dy = -dy;
				}

				if (x2 + dx2 > coords.x + coords.width - ballRadius || x2 + dx2 < coords.x) {
					dx2 = -dx2;
				}
				if (y2 + dy2 > coords.y + coords.height - ballRadius || y2 + dy2 < coords.y) {
					dy2 = -dy2;
				}
			});

			x += dx;
			y += dy;

			x2 += dx2;
			y2 += dy2;
		}

		var interval = setInterval(draw, 10);

		// Nettoyer l'intervalle lorsque le composant est démonté
		return () => {
			clearInterval(interval);
		};
	}, []);


	return (
		<>
			<PageLayout>
				<canvas
					id="myCanvas"
					className="absolute top-0 left-0 w-full h-full"
				></canvas>
				<div className="flex justify-center items-center">
					<main
						className="min-w-fit w-72 flex flex-col border border-white rounded-md p-20 gap-4">
						<h1 className="text-9xl font-bold text-[#f67539]">{statusCode}</h1>
						<h2 className="text-4xl font-bold text-[#f67539]">
							Page Not Found
						</h2>
						<button
							onClick={() => navigate("/")}
							className=" mt-10 py-4 px-4 bg-cyan-700  text-white rounded-md hover:bg-[#f67539]">
							Retour à l'accueil
						</button>
					</main>
				</div>
			</PageLayout>
		</>
	);
};

export default ErrorPage;





// import { useNavigate } from "react-router-dom";
// import AnimatedBalls from "../Components/AnimatedBalls";
// import PageLayout from "../Components/PageLayout";

// interface Props {
// 	statusCode: string;
// }

// const ErrorPage = ({ statusCode }: Props) => {
// 	const navigate = useNavigate();

// 	return (
// 		<>
// 			<PageLayout>
// 				<AnimatedBalls />
// 				<div className="flex justify-center items-center">
// 					<main
// 						className="min-w-fit w-96 flex flex-col border-white rounded-md p-20 gap-4">
// 						<h1 className="text-9xl font-bold text-[#f67539]">{statusCode}</h1>
// 						<h2 className="text-4xl font-bold text-[#f67539]">
// 							Page Not Found
// 						</h2>
// 						<button
// 							onClick={() => navigate("/")}
// 							className=" mt-10 py-4 px-4 bg-cyan-700  text-white rounded-md hover:bg-[#f67539]">
// 							Retour à l'accueil
// 						</button>
// 					</main>
// 				</div>
// 			</PageLayout>
// 		</>
// 	);
// };

// export default ErrorPage;

