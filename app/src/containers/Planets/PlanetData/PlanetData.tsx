import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, RouteComponentProps } from "react-router-dom";

interface MatchParams {
	star_id: string,
	planet_id: string,
}

export interface IPlanetDataProps extends RouteComponentProps<MatchParams> { }

export default (props: IPlanetDataProps) => {
	const [name, setName] = useState("");
	const [moonCount, setMoonCount] = useState(0);
	const [diameter, setDiameter] = useState(0.0);
	const [distanceFromStar, setDistanceFromStar] = useState(0.0);
	const [starName, setStarName] = useState("");

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const starID = props.match.params.star_id;
	const planetID = props.match.params.planet_id;

	useEffect(() => {
		(async () => {
			setLoading(true);

			try {
				const response = await axios.get(`/stars/${starID}/planets/${planetID}`);
				const planet = response.data;

				setName(planet.name);
				setMoonCount(planet.moonCount);
				setDiameter(planet.diameter);
				setDistanceFromStar(planet.distanceFromStar);
				setStarName(planet.starName);

				setError(null);
			}
			catch (error) {
				setError(error);
			}
			
			setLoading(false);
		})();
	}, [planetID, starID]);

	const deleteHandler = () => {
		(async () => {
			try {
				await axios.delete(`/stars/${starID}/planets/${planetID}`);

				props.history.push(`/stars/${starID}`);
			}
			catch (error) {
				console.error(error);
			}
		})();
	};

	if (loading) {
		return <p>Loading...</p>;
	}

	return (
		<div>
			<h2>{ name }</h2>
			<h3>Orbits { starName }</h3>
			<p><strong>Number of moons: </strong>{ moonCount }</p>
			<p><strong>Diameter (in Earth radii): </strong>{ diameter }</p>
			<p><strong>Distance from star (in AU): </strong>{ distanceFromStar }</p>

			<Link to={ planetID + "/edit" }>Edit</Link>
			<button onClick={ deleteHandler }>Delete</button>
			<br />
			<Link to={ "/stars/" + starID }>Return</Link>
		</div>
	);
};