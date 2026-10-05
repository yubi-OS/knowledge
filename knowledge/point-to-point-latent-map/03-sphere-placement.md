# Placement: from item to point on the 2-sphere

**Scope:** Placement of items on the 2-sphere: PCA top-2, stereographic lift, pole reference, geodesic and chordal distance. The map places each binarized item at a point on S² by z-scoring the bit matrix, taking the top 2 principal components, and lifting the resulting plane point through the inverse stereographic projection with a fixed scale; this doc grounds each step.

## Design context

After binarization under R0, each item is a row of d bits. The map computes the item's Hamming shell k = sum of bits, projects the z-scored bit matrix onto its top 2 principal components, and lifts the 2-D point to a unit vector p on the 2-sphere using the inverse stereographic projection with scale s = 0.9 divided by the maximum plane norm. A reference pole is the lift of the projection of the all-ones corner, and each item's gap is the chordal distance to that pole. The shell means form the empirical ladder. Each of these geometric steps has a classical published definition.

## Stereographic projection and its inverse

The stereographic projection maps a sphere (minus one point) onto a plane; its inverse maps the plane back onto the punctured sphere. Wolfram MathWorld gives the standard formulas: for the unit sphere, the inverse mapping takes a plane point (u, v) to a 3-D unit vector, with the projection point (the north pole) having no preimage in the plane [https://mathworld.wolfram.com/StereographicProjection.html, weight 0.86]. The same source records the projection's key properties: it is conformal (angle preserving) and maps circles to circles.

University course notes derive the inverse map explicitly: a plane point at radius r from the origin lifts to the point whose coordinates mix the plane coordinates with the sphere height, with the south pole at the plane origin and the north pole as the point at infinity [https://pi.math.cornell.edu/~boyang/2220%20s2017/math2220_notes/notes_sec_2.1.pdf, weight 0.69]. Lecture notes from the University of Washington list the properties that make the projection useful for visualization: conformality, preservation of circles, and the fact that the metric distortion grows with distance from the projection origin, so points far out in the plane crowd near the pole [https://sites.math.washington.edu/~king/coursedir/m445w03/class/01-31-stereoprop.html, weight 0.70]. The LibreTexts geometry text presents the same construction with worked coordinates [https://math.libretexts.org/Bookshelves/Abstract_and_Geometric_Algebra/Introduction_to_Groups_and_Geometries_(Lyons)/01:_Preliminaries/1.03:_Stereographic_projection, weight 0.73].

The map's lift scale s exists because of that crowding: an unscaled plane cloud whose largest radius approaches infinity would push its outer items onto the pole. Choosing s = 0.9 over the maximum observed plane norm keeps every item off the pole by construction, so the pole remains a pure reference point rather than a occupied location.

Wikipedia's stereographic projection article is the canonical overview but the dig weighted it low (0.12); the same content is better sourced above and this doc relies on the higher-weighted references [https://en.wikipedia.org/wiki/Stereographic_projection, weight 0.12, weak backing].

## Distances on the sphere: geodesic versus chordal

Two distances appear in the map: the geodesic (great-circle) distance along the sphere surface, and the chordal distance, the straight-line Euclidean distance through the ambient 3-D space. Wikipedia's great-circle distance article gives the central angle theta between two points from their dot product via the arccosine form and notes the haversine formulation as the numerically stabler variant for small angles [https://en.wikipedia.org/wiki/Great-circle_distance, weight 0.81]. The haversine article states the formula 2 R arcsin(sqrt(sin²(dphi/2) + cos(phi1) cos(phi2) sin²(dlambda/2))) [https://en.wikipedia.org/wiki/Haversine_formula, weight 0.78].

MathWorld's spherical distance page gives the relation between the two distances directly: for a unit sphere, the geodesic distance equals arcsin of the half-chord, equivalently the chord is 2 sin(theta/2) for central angle theta [https://mathworld.wolfram.com/SphericalDistance.html, weight 0.84]. This is the conversion the map relies on: it measures the chordal gap to the pole (cheap, no arccosine, no numerical trouble near zero) while reasoning about it as a monotone proxy for the geodesic gap. The monotonicity holds because chord = 2 sin(theta/2) is strictly increasing on theta in [0, pi].

The map reports gap as the chordal distance and shell means as the empirical ladder. Because the chord-to-angle map is monotone, ordering claims about gaps are ordering claims about geodesic distances, but any reported number in radians is an angle derived by choice, not by the map's output format.

## What placement asserts

1. The inverse stereographic projection is the standard, conformal, circle-preserving route from a plane to the 2-sphere, with one point (the pole) not in the image [https://mathworld.wolfram.com/StereographicProjection.html, weight 0.86].
2. Metric distortion grows away from the plane origin, so a fixed lift scale is required to keep the outer items from crowding onto the pole [https://sites.math.washington.edu/~king/coursedir/m445w03/class/01-31-stereoprop.html, weight 0.70].
3. Chordal and geodesic distances are related by chord = 2 sin(theta/2) on the unit sphere, a strictly monotone relation, so the map may report chords while meaning angle orderings [https://mathworld.wolfram.com/SphericalDistance.html, weight 0.84].

## Sources considered

| Source | Weight |
|---|---|
| Stereographic Projection, Wolfram MathWorld | 0.86 |
| Spherical Distance, Wolfram MathWorld | 0.84 |
| Great-circle distance, Wikipedia | 0.81 |
| Haversine formula, Wikipedia | 0.78 |
| Stereographic projection, Mathematics LibreTexts | 0.73 |
| Properties of Stereographic Projection, UW Math | 0.70 |
| MATH 2220 notes on stereographic projection, Cornell | 0.69 |
| Stereographic projection definition, Mathwords | 0.60 |
| Great-circle distance, HandWiki | 0.12 |
| Stereographic projection, Wikipedia | 0.12 |
| Great circle distance formula, GeeksforGeeks | 0.21 |
| GREAT, Cambridge Dictionary (off topic) | 0.94 |
