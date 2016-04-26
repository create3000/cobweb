
define ([
	"standard/Geospatial/Geodetic",
	"standard/Math/Numbers/Vector3",
	"standard/Math/Algorithm",
],
function (Geodetic,
          Vector3,
          Algorithm)
{
"use strict";

	var
		N0 = 1.0e7,
		E0 = 5.0e5,
		k0 = 0.9996;

	function UniversalTransverseMercator (spheroid, zone, northernHemisphere, northingFirst)
	{
		var
			a    = spheroid .getSemiMajorAxis (),
			ecc2 = 1 - Math .pow (spheroid .getSemiMinorAxis () / a, 2),
			EE   = ecc2 / (1 - ecc2),
			e1   = (1 - Math .sqrt (1 - ecc2)) / (1 + Math .sqrt (1 - ecc2));

		this .southernHemisphere = ! northernHemisphere;
		this .eastingFirst       = ! northingFirst;
		this .a                  = a;
		this .ecc2               = ecc2;
		this .EE                 = EE;
		this .E8                 = 8 * EE;
		this .E9                 = 9 * EE;
		this .E252               = 252 * EE;
		this .e1                 = e1;
		this .A                  = k0 * (a * (1 - ecc2 / 4 - 3 * ecc2 * ecc2 / 64 - 5 * ecc2 * ecc2 * ecc2 / 256));
		this .B                  = 3 * e1 / 2 - 7 * e1 * e1 * e1 / 32;
		this .C                  = 21 * e1 * e1 / 16 - 55 * e1 * e1 * e1 * e1 / 32;
		this .D                  = 151 * e1 * e1 * e1 / 96;
		this .E                  = a * (1 - ecc2);
		this .W                  = 1 - ecc2 / 4 - 3 * ecc2 * ecc2 / 64 - 5 * ecc2 * ecc2 * ecc2 / 256;
		this .X                  = 3 * ecc2 / 8 + 3 * ecc2 * ecc2 / 32 + 45 * ecc2 * ecc2 * ecc2 / 1024;
		this .Y                  = 15 * ecc2 * ecc2 / 256 + 45 * ecc2 * ecc2 * ecc2 / 1024;
		this .Z                  = 35 * ecc2 * ecc2 * ecc2 / 3072;
		this .longitude0         = Algorithm .radians (zone * 6 - 183);
		this .geodeticConverter  = new Geodetic (spheroid, true, true);
	}

	UniversalTransverseMercator .prototype =
	{
		constructor: UniversalTransverseMercator,
		convert: function (utm, result)
		{
			// https://gist.github.com/duedal/840476
		
			if (this .eastingFirst)
			{
				var
					northing = utm .y;
					easting  = utm .x;
			}
			else
			{
				var
					northing = utm .x,
					easting  = utm .y;
			}
		
			// Check for southern hemisphere and remove offset from easting.
		
			var S = this .southernHemisphere;
		
			if (northing < 0)
			{
				S        = ! this .southernHemisphere;
				northing = -northing;
			}
		
			if (S)
				northing -= N0;
		
			easting -= E0;
		
			// Begin calculation.
		
			var
				mu   = northing / this .A,
				phi1 = mu + this .B * Math .sin (2 * mu) + this .C * Math .sin (4 * mu) + this .D * Math .sin (6 * mu);
		
			var
				sinphi1 = Math .pow (Math .sin (phi1), 2),
				cosphi1 = Math .cos (phi1),
				tanphi1 = Math .tan (phi1);
		
			var
				N1 = this .a / Math .sqrt (1 - this .ecc2 * sinphi1),
				T2 = Math .pow (tanphi1, 2),
				T8 = Math .pow (tanphi1, 8),
				C1 = this .EE * T2,
				C2 = C1 * C1,
				R1 = this .E / Math .pow (1 - this .ecc2 * sinphi1, 1.5),
				I  = easting / (N1 * k0);
		
			var
				J = (5 + 3 * T2 + 10 * C1 - 4 * C2 - this .E9) * Math .pow (I, 4) / 24,
				K = (61 + 90 * T2 + 298 * C1 + 45 * T8 - this .E252 - 3 * C2) * Math .pow (I, 6) / 720,
				L = (5 - 2 * C1 + 28 * T2 - 3 * C2 + this .E8 + 24 * T8) * Math .pow (I, 5) / 120;
		
			var
				latitude  = phi1 - (N1 * tanphi1 / R1) * (I * I / 2 - J + K),
				longitude = this .longitude0 + (I - (1 + 2 * T2 + C1) * Math .pow (I, 3) / 6 + L) / cosphi1;
		
			return this .geodeticConverter .convertRadians (latitude, longitude, utm .z, result);
		},
		apply: function (geocentric, result)
		{
			// https://gist.github.com/duedal/840476

			var
				geodetic  = this .geodeticConverter .applyRadians (geocentric, result),
				latitude  = geodetic .x,
				longitude = geodetic .y;
		
			var
				tanlat = Math .tan (latitude),
				coslat = Math .cos (latitude);
		
			var
				EE = this .EE,
				N  = this .a / Math .sqrt (1 - this .ecc2 * Math .pow (Math .sin (latitude), 2)),
				T  = tanlat * tanlat,
				T6 = T * T * T,
				C  = EE * coslat * coslat,
				A  = coslat * (longitude - this .longitude0);
		
			var M = this .a * (this .W * latitude
			                   - this .X * Math .sin (2 * latitude)
			                   + this .Y * Math .sin (4 * latitude)
			                   - this .Z * Math .sin (6 * latitude));
		
			var easting = k0 * N * (A + (1 - T + C) * Math .pow (A, 3) / 6
			                        + (5 - 18 * T6 + 72 * C - 58 * EE) * Math .pow (A, 5) / 120)
			              + E0;
		
			var northing = k0 * (M + N * tanlat * (A * A / 2 + (5 - T + 9 * C + 4 * C * C) * Math .pow (A, 4) / 24
			                                       + (61 - 58 * T6 + 600 * C - 330 * EE) * Math .pow (A, 6) / 720));
		
			if (latitude < 0)
			{
				northing += N0;
				
				if (! this .southernHemisphere)
					northing = -northing;
			}
			else
			{
				if (this .southernHemisphere)
					northing = -northing;		
			}
		
			if (this .eastingFirst)
				return result .set (easting, northing, geodetic .z);
		
			return result .set (northing, easting, geodetic .z);
		},
		//lerp: Vector3 .lerp,
	};

	return UniversalTransverseMercator;
});
