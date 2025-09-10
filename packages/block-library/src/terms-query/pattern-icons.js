/**
 * WordPress dependencies
 */
import { Path, SVG } from '@wordpress/components';

export const link = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
		<Path d="m 13,23 h 22 v 3 H 13 Z" />
	</SVG>
);

export const titleLink = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
		<Path d="m 7,24 h 18 v 3 H 7 Z M 41,20 H 7 v 2 h 34 z" />
	</SVG>
);

export const titleDescriptionLink = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
		<Path d="m 7,27 h 18 v 3 H 7 Z M 37,17 H 7 v 2 h 30 z m 4,4 H 7 v 1 H 41 Z M 7,24 h 30 v 1 H 7 Z" />
	</SVG>
);
