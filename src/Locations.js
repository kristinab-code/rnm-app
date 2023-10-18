import React, { useEffect, useState } from 'react';

const Locations = () => {
	const [locations, setLocations] = useState([]);
	const [hoveredLocation, setHoveredLocation] = useState();

	useEffect(() => {
		const getData = async (url) => {
			try {
				const response = await fetch(url);
				const data = await response.json();
				// console.log('first page data', data);

				if (data.info.next) {
					const nextPage = await getData(data.info.next);
					// console.log('next page data', nextPage);
					return data.results.concat(nextPage);
				} else {
					return data.results;
				}
			} catch (error) {
			  console.error('Error', error);
			}
		}

		getData('https://rickandmortyapi.com/api/location')
			.then(data => {
				const locationsWithBgColor = data.map(location => ({
				  ...location,
				  color: location.residents.length > 0 ? (`#${(Math.floor(Math.random() * Math.pow(16, 6))).toString(16)}`).padStart(7, '0') : "#cccccc"
				}));
				// console.log(locationsWithBgColor);
				setLocations(locationsWithBgColor);
			});
	}, []);

	const maxWidth = Math.max(...locations.map(location => location.residents.length));
	const height = 50;

	// console.log(locations);

	const Popup = ({ location: {name, residents, type, dimension, color} }) => {
		return (
			<div className = "popup" style = {{ borderColor: color }}>
				<h2>{name}</h2>
				<p>Residents: {residents.length}</p>
				<p>Type: {type}</p>
				<p>Dimension: {dimension}</p>
			</div>
		)
	}

	return (
		<div className="wrapper">
			<svg width="100%" height={height * locations.length}>
				<defs>
					<pattern pattern id="diagonal"
					width="10"
					height="10"
					patternTransform="rotate(45 0 0)"
					patternUnits="userSpaceOnUse">
						<line x1="0" y1="0" x2="0" y2="10" style={{stroke: "#cccccc", strokeWidth: 1}} />
					</pattern>
				</defs>
				{locations.map((location, index) => {
					const residents = location.residents.length;
					const width = (residents / maxWidth) * 100;
					
					return (
						<g key={location.id}>
							<rect
								x={0}
								y={index * height} 
								width={residents > 0 ? `${width}%` : "100%"} 
								height={height}
								fill={location.color}
								style={{
									fill: residents > 0 ? "" : "url(#diagonal)"
								}}
								onMouseEnter = {
								  () => setHoveredLocation(location)
								}
								onMouseLeave = {
								  () => setHoveredLocation(null)
								}
							/>
							<text
								x={0.5}
								y={(index * height) + height * 0.5}
							>
								{residents}
							</text>
						</g>
					);
				})}
			</svg>
			{hoveredLocation && <Popup location={hoveredLocation} />}
		</div>
	);
};

export default Locations;
