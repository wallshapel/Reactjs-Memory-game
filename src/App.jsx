import React, { useState, useEffect } from 'react';
import Card from './Components/Card';	
import './App.css';

function App() {

	const [name, setName] = useState(''); 
	const [gameState, setGameState] = useState(false);
	const [cards, setCards] = useState([]);
	const [firstCard, setFirstCard] = useState({});
  	const [secondCard, setSecondCard] = useState({});
  	const [unflippedCards, setUnflippedCards] = useState([]); // Arreglo de los números de cartas que necesitan volver su posición inicial
  	const [disabledCards, setDisabledCards] = useState([]);  // Arreglo de los números de cartas que necesitan ser deshabilitadas porque ya hicieron match 
  	const [hits, setHits] = useState(0);
  	const [miss, setMiss] = useState(0);

	const getImagesAndNames = async () => {
		const res = await fetch('https://fed-team.modyo.cloud/api/content/spaces/animals/types/game/entries?per_page=20');
		const data = await res.json();
		let images = [];
		for (let i = 0; i < 20; ++i) {
			images.push({
				src: data.entries[i].fields.image.url,
				name: data.entries[i].fields.image.title	
			})
		}
		return images
	}

	const getCards = async () => {
		const images = await getImagesAndNames();
		let deck = [];
		const limit = randomNumber(9, 20);  // Elegimos 9 de las 20 cartas disponibles			
		let i = limit - 9;
		for (i; i < limit; ++i) {
			deck.push(images[i]);
			deck.push(images[i]);
		}
		deck.sort(() => Math.random() - 0.5); // Desordenamos el arreglo
		setCards(deck); 
	}			

	useEffect(() => {
		getCards();	
		// La siguiente línea comentada y que hay que dejarla comentada para que funcione; quita el warning que sale en consola 'dependencia faltante'
	    // eslint-disable-next-line react-hooks/exhaustive-deps 	
	}, [])

	useEffect(() => {
    	checkForMatch();
    	// La siguiente línea comentada y que hay que dejarla comentada para que funcione; quita el warning que sale en consola: 'Dependencia faltante'
    	// eslint-disable-next-line react-hooks/exhaustive-deps 
  	}, [secondCard])  // Este useEffect se va a ejecutar cada vez que secondCard sea modificado

	const flipCard = (name, number) => {  // Evento cuando se intenta voltear cualquier carta
	    if (firstCard.name === name && firstCard.number === number) // Se intenta voltear la misma carta
	      	return 0;
	    if (!firstCard.name)  // Aún no se ha volteado la primera carta
	    	setFirstCard({ name, number });
	    else if (!secondCard.name)  // Se ha volteado la primera carta pero aún no se ha volteado la segunda carta
	      	setSecondCard({ name, number });
	    return 1;  // Devolverá 1 para los demás casos porque significa que tanto la primera como la segunda carta fueron volteadas
	}

	const randomNumber = (min, max) => { // min and max included 
  		return Math.floor(Math.random() * (max - min + 1) + min)
	}

	const checkForMatch = () => {
		if (firstCard.name && secondCard.name) { // Verifica primero que no sean vacías estas variables ya que al principio están vacías
			const match = firstCard.name === secondCard.name;
			if (match) {
				disableCards();
				setHits(hits + 1);
			} else {
				unflipCards();
				setMiss(miss + 1);
			}
		}
	}

	const resetCards = () => {
    	setFirstCard({});
    	setSecondCard({});
  	}

  	const unflipCards = () => {
  		setUnflippedCards([firstCard.number, secondCard.number]);
	    resetCards();
	}

	const disableCards = () => {
		setDisabledCards([firstCard.number, secondCard.number]);
	    resetCards();
	}

	const start = () => {
		if (name !== '')
			setGameState(true); // Juego iniciado.	
		else {
			alert('Type a name');
			document.getElementById('name').focus();
		}
	}

	const start2 = (e) => { // Hace lo mimso que la función start pero cuando se presiona la tecla enter
    	if(e.keyCode === 13) // 'Tecla enter'
    		start();
    }

    const newGame = () => {
    	reset();
    	setGameState(false);
    }

    const reset = () => {
    	setCards([]);
    	setFirstCard({});
    	setSecondCard({});
    	setUnflippedCards([]);
    	setDisabledCards([]);
    	setHits(0);
    	setMiss(0);
    	setName('')
    	getCards();
    }

	if (gameState === false) {
		return (
			<div className='login-form_stargame'>
				<input type='text' id='name' onChange={(e) => setName(e.target.value) } onKeyDown={ start2 } autoFocus placeholder='Type your name' />
				<button onClick={ start }>Start</button>
			</div>
		)
	}

	return (
		<div>
			<div className='element-info'>
				<h2>HITS: { hits }</h2>
				<h2>MISS: { miss }</h2>						
			</div>		
			<div className='element-info2'>
				<h3>{ hits === 9 ? `GONTRATULATIONS ${ name }` : `` }</h3>
				<button onClick={ newGame }>New Game</button>
				<button onClick={ reset }>Reset</button>		
			</div>
			<div className='app'>					
				<div className='cards-container'>
					{
						cards.map((card, i) => (
							<Card 
								key={ i } 
								name={ card.name } 
								number={ i } 
								frontFace={ card.src } 
								flipCard={ flipCard } 
								unflippedCards={ unflippedCards }
	              				disabledCards={ disabledCards }
							/>
						))	
					}			
				</div>
			</div>
		</div>		
	)
	
}

export default App;