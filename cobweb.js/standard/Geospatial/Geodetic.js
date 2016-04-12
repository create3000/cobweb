
define ([
	"standard/Math/Algorithm",
],
function (Algorithm)
{
"use strict";

	var
		EPS_H = 1e-3,
		EPS_P = 1e-10,
		IMAX  = 30;
		
	function Geodetic (spheroid, latitudeFirst, radians)
	{
		this .longitudeFirst = ! latitudeFirst;
      this .degrees        = ! radians;
      this .a              = spheroid .getSemiMajorAxis ();
      this .c2a2           = Math .pow (spheroid .getSemiMinorAxis () / this .a, 2);
      this .ecc2           = 1 - this .c2a2;
	}

	Geodetic .prototype =
	{
		constructor: Geodetic,
		convert: function (geodetic, result)
		{
			var elevation = geodetic .z;

			if (this .longitudeFirst)
			{
				var
					latitude  = geodetic .y;
					longitude = geodetic .x;
			}
			else
			{
				var
					latitude  = geodetic .x,
					longitude = geodetic .y;
			}
		
			if (this .degrees)
			{
				latitude  = Algorithm .radians (latitude);
				longitude = Algorithm .radians (longitude);
			}
		
			return this .convertRadians (latitude, longitude, elevation, result);
		},
		convertRadians: function (latitude, longitude, elevation, result)
		{
			var
				slat  = Math .sin (latitude),
				slat2 = Math .pow (slat, 2),
				clat  = Math .cos (latitude),
				N     = this .a / Math .sqrt (1 - this .ecc2 * slat2),
				Nhl   = (N + elevation) * clat;

			return result .set (Nhl * Math .cos (longitude),
			                    Nhl * Math .sin (longitude),
			                    (N * this .c2a2 + elevation) * slat);
		},
		apply: function (geocentric, result)
		{
			this .applyRadians (geocentric, result);

			if (this .degrees)
			{
				result .x = Algorithm .degrees (result .x); // latitude
				result .y = Algorithm .degrees (result .y); // longitude
			}

			if (this .longitudeFirst)
			{
				var tmp = result .x;

				result .x = result .y; // latitude
				result .y = tmp;       // longitude
			}

			return result;
		},
		applyRadians: function (geocentric, result)
		{
			var
				x = geocentric .x,
				y = geocentric .y,
				z = geocentric .z;
		
			var P = Math .sqrt (x * x + y * y);
		
			var
				latitude  = 0,
				longitude = Math .atan2 (y, x),
				elevation = 0;
		
			var
				a    = this .a,
				N    = a,
				ecc2 = this .ecc2;
		
			for (var i = 0; i < IMAX; ++ i)
			{
				var
					h0 = elevation,
					b0 = latitude;
		
				latitude = Math .atan (z / P / (1 - ecc2 * N / (N + elevation)));
		
				var sin_p = Math .sin (latitude);
		
				N         = a / Math .sqrt (1 - ecc2 * sin_p * sin_p);
				elevation = P / Math .cos (latitude) - N;
		
				if (Math .abs (elevation - h0) < EPS_H && Math .abs (latitude - b0) < EPS_P)
					break;
			}

			return result .set (latitude, longitude, elevation);
		},
		normal: function (geocentric, result)
		{
			var geodetic = this .applyRadians (geocentric, result);

			var
				latitude  = geodetic .x,
				longitude = geodetic .y;

			var clat = Math .cos (latitude);

			var
				nx = Math .cos (longitude) * clat,
				ny = Math .sin (longitude) * clat,
				nz = Math .sin (latitude);

			return result .set (nx, ny, nz);
		},
	};

	return Geodetic;
});
