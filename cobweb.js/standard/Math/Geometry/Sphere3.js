
define ([
	"standard/Math/Numbers/Vector3",
],
function (Vector3)
{
"use strict";

	var
		L  = new Vector3 (0, 0, 0),
		AB = new Vector3 (0, 0, 0),
		AC = new Vector3 (0, 0, 0),
		BC = new Vector3 (0, 0, 0),
		CA = new Vector3 (0, 0, 0),
		Q1 = new Vector3 (0, 0, 0),
		Q2 = new Vector3 (0, 0, 0),
		Q3 = new Vector3 (0, 0, 0);

	function Sphere3 (radius, center)
	{
		this .radius = radius;
		this .center = center .copy ();
	}

	Sphere3 .prototype =
	{
		constructor: Sphere3,
		set: function (radius, center)
		{
			this .radius = radius;
			this .center .assign (center);
		},
		intersectsLine: function (line, intersection1, intersection2)
		{
			L .assign (this .center) .subtract (line .point);

			var tca = Vector3 .dot (L, line .direction);

			if (tca < 0)
				// there is no intersection
				return false;

			var
				d2 = Vector3 .dot (L, L) - Math .pow (tca, 2),
				r2 = Math .pow (this .radius, 2);

			if (d2 > r2)
				return false;

			var thc = Math .sqrt (r2 - d2);

			var
				t1 = tca - thc,
				t2 = tca + thc;

			intersection1 .assign (line .direction) .multiply (t1) .add (line .point);
			intersection2 .assign (line .direction) .multiply (t2) .add (line .point);

			return true;
		},
		intersectsTriangle: function (A, B, C)
		{
			var
				P = this .center,
				r = this .radius;

			A .subtract (P);
			B .subtract (P);
			C .subtract (P);

			// Testing if sphere lies outside the triangle plane.

			AB .assign (B) .subtract (A);
			AC .assign (C) .subtract (A);

			var
				rr   = r * r,
				V    = AB .cross (AC),
				d    = Vector3 .dot (A, V),
				e    = Vector3 .dot (V, V),
				sep1 = d * d > rr * e;

			if (sep1)
				return false;

			// Testing if sphere lies outside a triangle vertex.
			var
				aa   = Vector3 .dot (A, A),
				ab   = Vector3 .dot (A, B),
				ac   = Vector3 .dot (A, C),
				bb   = Vector3 .dot (B, B),
				bc   = Vector3 .dot (B, C),
				cc   = Vector3 .dot (C, C),
				sep2 = (aa > rr) && (ab > aa) && (ac > aa),
				sep3 = (bb > rr) && (ab > bb) && (bc > bb),
				sep4 = (cc > rr) && (ac > cc) && (bc > cc);

			if (sep2 || sep3 || sep4)
				return false;

			// Testing if sphere lies outside a triangle edge.

			AB .assign (B) .subtract (A);
			BC .assign (C) .subtract (B);
			CA .assign (A) .subtract (C);

			var
				d1   = ab - aa,
				d2   = bc - bb,
				d3   = ac - cc,
				e1   = Vector3 .dot (AB, AB),
				e2   = Vector3 .dot (BC, BC),
				e3   = Vector3 .dot (CA, CA);
			
			Q1 .assign (A) .multiply (e1) .subtract (AB .multiply (d1));
			Q2 .assign (B) .multiply (e2) .subtract (BC .multiply (d2));
			Q3 .assign (C) .multiply (e3) .subtract (CA .multiply (d3));

			var
				QC   = C .multiply (e1) .subtract (Q1),
				QA   = A .multiply (e2) .subtract (Q2),
				QB   = B .multiply (e3) .subtract (Q3),
				sep5 = (Vector3 .dot (Q1, Q1) > rr * e1 * e1) && (Vector3 .dot (Q1, QC) > 0),
				sep6 = (Vector3 .dot (Q2, Q2) > rr * e2 * e2) && (Vector3 .dot (Q2, QA) > 0),
				sep7 = (Vector3 .dot (Q3, Q3) > rr * e3 * e3) && (Vector3 .dot (Q3, QB) > 0);

			if (sep5 || sep6 || sep7)
				return false;

			return true;
		},
		toString: function ()
		{
			return this .radius + " " + this .center .toString ();
		},
	};

	return Sphere3;
});
