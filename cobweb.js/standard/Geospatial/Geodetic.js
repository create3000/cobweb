
define ([
	"standard/Math/Numbers/Vector3",
	"standard/Math/Algorithm",
],
function (Vector3,
          Algorithm)
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
				latitude  *= Math .PI / 180;
				longitude *= Math .PI / 180;
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
				result .x *= 180 / Math .PI; // latitude
				result .y *= 180 / Math .PI; // longitude
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
		lerp: function (s, d, t)
		{
			var
				source     =  this .source      .assign (s),
				destination = this .destination .assign (d);

			var
				RANGE    = this .degrees ? 180 : M_PI,
				RANGE1_2 = RANGE / 2,
				RANGE2   = RANGE * 2;
		
			var range = 0;
		
			if (this .longitudeFirst)
			{
				source .x = Algorithm .interval (source .x, -RANGE,    RANGE);	
				source .y = Algorithm .interval (source .y, -RANGE1_2, RANGE1_2);
		
				destination .x = Algorithm .interval (destination .x, -RANGE,    RANGE);	
				destination .y = Algorithm .interval (destination .y, -RANGE1_2, RANGE1_2);
		
				range = Math .abs (destination .x - source .x);
			}
			else
			{
				source .x = Algorithm .interval (source .x, -RANGE1_2, RANGE1_2);
				source .y = Algorithm .interval (source .y, -RANGE,    RANGE);
		
				destination .x = Algorithm .interval (destination .x, -RANGE1_2, RANGE1_2);
				destination .y = Algorithm .interval (destination .y, -RANGE,    RANGE);
		
				range = Math .abs (destination .y - source .y);
			}
		
			if (range <= RANGE)
				return source .lerp (destination, t);
		
			var step = (RANGE2 - range) * t;
		
			if (this .longitudeFirst)
			{
				var longitude = source .x < destination .x ? source .x - step : source .x + step;
		
				if (longitude < -RANGE)
					longitude += RANGE2;
		
				else if (longitude > RANGE)
					longitude -= RANGE2;
		
				return source .set (longitude,
				                    Algorithm .lerp (source .y, destination .y, t),
				                    Algorithm .lerp (source .z, destination .z, t));
			}

			var longitude = source .y < destination .y ? source .y - step : source .y + step;
	
			if (longitude < -RANGE)
				longitude += RANGE2;
	
			else if (longitude > RANGE)
				longitude -= RANGE2;
	
			return source .set (Algorithm .lerp (source .x, destination .x, t),
			                    longitude,
			                    Algorithm .lerp (source .z, destination .z, t));
		},
		source: new Vector3 (0, 0, 0),
		destination: new Vector3 (0, 0, 0),
	};

	return Geodetic;
});
