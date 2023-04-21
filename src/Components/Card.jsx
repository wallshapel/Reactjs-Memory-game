import React, { useState, useEffect } from 'react';
import ReactCardFlip from 'react-card-flip';
import backFace from './images/question.png';

const Card = ({ name, number, frontFace, flipCard, unflippedCards, disabledCards }) => {

	const [isFlipped, setIsFlipped] = useState(true);  // Comienza el juego con las cartas boca arriba
	const [hasEvent, setHasEvent] = useState(true);

	useEffect(() => {
		setTimeout(() => setIsFlipped(false), 6000);  // Luego de 2 segundos comenzado el juego, pon las cartas boca abajo.
	}, [])

	useEffect(() => {
	    if (unflippedCards.includes(number))  // Si en el arreglo unflippedCards se encuentra incluido el número de la carta actual
	    	setTimeout(() => setIsFlipped(false), 700);  // Entonces la carta debe ir boca abajo
	    // La siguiente línea comentada y que hay que dejarla comentada para que funcione; quita el warning que sale en consola 'dependencia faltante'
	    // eslint-disable-next-line react-hooks/exhaustive-deps 
	}, [unflippedCards])  // Este useEffect se va a ejecutar cada vez q unflippedCards sea modificado

	useEffect(() => {
	    if (disabledCards.includes(number))
	      	setHasEvent(false);
	    // eslint-disable-next-line react-hooks/exhaustive-deps 
	}, [disabledCards])  // Este useEffect se va a ejecutar cada vez que disabledCards haya sido modificado en el componete App

	const flip = () => {
		const value = flipCard(name, number);
		if (value !== 0)
			setIsFlipped(!isFlipped); // Voltea la carta solo si no es la misma que acabamos de voltear
	}
	
	if (isFlipped) {
		return (
			<div className='card'>
				<ReactCardFlip isFlipped={ isFlipped }>
					<img src={ backFace } alt={ name } className="card-image" />	
					<img src={ frontFace } alt={ name } className="card-image" />	
				</ReactCardFlip>
			</div>
		)		
	} else {
		return (
			<div className='card'>
				<ReactCardFlip isFlipped={ isFlipped }>
					<img src={ backFace } alt={ name } className="card-image" onClick={ hasEvent ? flip : null } />	
					<img src={ frontFace } alt={ name } className="card-image" onClick={ hasEvent ? flip : null } />	
				</ReactCardFlip>
			</div>
		)			
	}
	
}

export default Card;