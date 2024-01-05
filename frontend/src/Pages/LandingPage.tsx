import FooterMain from "../Components/FooterMain";
import PageLayout from "../Components/PageLayout";

import { useEffect } from "react";

const LandingPage = () => {
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
    var x = canvas.width / 3;
    var y = canvas.height - 40;
    var dx = 3;
    var dy = -3;

    // Variables pour la nouvelle balle
    var x2 = 20;
    var y2 = 20;
    var dx2 = 3;
    var dy2 = -3;

    function drawBall() {
      if (!ctx) {
        return;
      }
      ctx.beginPath();
      ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = "#f67539";
      ctx.fill();
      ctx.closePath();
    }

    // Fonction pour dessiner la nouvelle balle
    function drawBall2() {
      if (!ctx) {
        return;
      }
      ctx.beginPath();
      ctx.arc(x2, y2, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = "#0095DD";
      ctx.fill();
      ctx.closePath();
    }

    // Obtenir les boutons et leurs coordonnées
    var buttons = Array.from(document.querySelectorAll("button"));
    var buttonCoords = buttons.map((button) => {
      var rect = button.getBoundingClientRect();
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

      buttonCoords.forEach((coords) => {
        if (
          x < coords.x &&
          x + dx > coords.x &&
          y + dy > coords.y &&
          y + dy < coords.y + coords.height
        ) {
          dx = -dx;
        } else if (
          x > coords.x + coords.width &&
          x + dx < coords.x + coords.width &&
          y + dy > coords.y &&
          y + dy < coords.y + coords.height
        ) {
          dx = -dx;
        }
        if (
          y < coords.y &&
          y + dy > coords.y &&
          x + dx > coords.x &&
          x + dx < coords.x + coords.width
        ) {
          dy = -dy;
        } else if (
          y > coords.y + coords.height &&
          y + dy < coords.y + coords.height &&
          x + dx > coords.x &&
          x + dx < coords.x + coords.width
        ) {
          dy = -dy;
        }
        if (
          x2 < coords.x &&
          x2 + dx2 > coords.x &&
          y2 + dy2 > coords.y &&
          y2 + dy2 < coords.y + coords.height
        ) {
          dx2 = -dx2;
        } else if (
          x2 > coords.x + coords.width &&
          x2 + dx2 < coords.x + coords.width &&
          y2 + dy2 > coords.y &&
          y2 + dy2 < coords.y + coords.height
        ) {
          dx2 = -dx2;
        } else if (
          y2 < coords.y &&
          y2 + dy2 > coords.y &&
          x2 + dx2 > coords.x &&
          x2 + dx2 < coords.x + coords.width
        ) {
          dy2 = -dy2;
        } else if (
          y2 > coords.y + coords.height &&
          y2 + dy2 < coords.y + coords.height &&
          x2 + dx2 > coords.x &&
          x2 + dx2 < coords.x + coords.width
        ) {
          dy2 = -dy2;
        }
      });

      if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
      }
      if (y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
        dy = -dy;
      }

      // Mouvement de la nouvelle balle
      if (x2 + dx2 > canvas.width - ballRadius || x2 + dx2 < ballRadius) {
        dx2 = -dx2;
      }
      if (y2 + dy2 > canvas.height - ballRadius || y2 + dy2 < ballRadius) {
        dy2 = -dy2;
      }

      x += dx;
      y += dy;

      // Mise à jour de la position de la nouvelle balle
      x2 += dx2;
      y2 += dy2;
    }

    var interval = setInterval(draw, 10);

    // Nettoyer l'intervalle lorsque le composant est démonté
    return () => {
      clearInterval(interval);
    };
  }, []);

  // Rest of your componen
  return (
    <>
      <PageLayout>
        <canvas
          id="myCanvas"
          className="absolute top-0 left-0 w-full h-full z-0"
        ></canvas>
        <div className="w-full h-full grow flex flex-col items-center justify-center gap-12 pb-12 z-10">
          <div className="text-center">
            <h1 className="text-9xl flex flex-col leading-none">
              <span className="flex flex-row items-start text-[#f67539]">
                PONG<sup className="text-base text-[#fa5a45]">42</sup>
              </span>
            </h1>
            <h2 className="text-xl text-[#fa5a45] hover:text-[#f67539] font-light ml-2 tracking-widest pr-4 ">
              ft_transcendance @42Lausanne
            </h2>
          </div>
          <div className="flex gap-4">
            <button
              className=" text-white py-2 px-4 rounded-md  bg-cyan-700 hover:bg-[#f67539] hover:border-none"
              onClick={() => (window.location.href = "/login")}
            >
              Se connecter
            </button>
            <button
              className="py-2 px-4 rounded-md bg-cyan-700  text-white hover:bg-[#f67539] hover:border-none"
              onClick={() => (window.location.href = "/signin")}
            >
              S'inscrire
            </button>
            <button
              className="py-2 px-4 bg-cyan-700  text-white rounded-md hover:bg-[#f67539] hover:border-none"
              onClick={() => (window.location.href = "/api/auth/school42")}
            >
              Se connecter via 42
            </button>
          </div>
        </div>
      </PageLayout>
      <FooterMain />
    </>
  );
};

export default LandingPage;

{
  /* <>
<PageHeader>Homepage</PageHeader>
<main className="h-full">
	<div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
		<div className="flex items-center justify-center h-full w-full pt-10">
			<div className="max-w-xl">
				<FormLogin />
			</div>
		</div>
	</div>
</main>
</> */
}
