
define ([
	"standard/Geospatial/ReferenceEllipsoids",
	"standard/Geospatial/Geodetic",
	"standard/Geospatial/UniversalTransverseMercator",
	"cobweb/Browser/Geospatial/Geocentric",
],
function (ReferenceEllipsoids,
          Geodedic,
          UniversalTransverseMercator,
          Geocentric)
{
"use strict";

	var
		i   = 0,
		GD  = i ++,
		UTM = i ++,
		GC  = i ++;

	var CoordinateSystems = {
		GD:  GD,
		GDC: GD,
		UTM: UTM,
		GC:  GC,
		GCC: GC,
		GS:  GC,
	};
	
	var Zone = /^Z(\d+)$/;

	var Geospatial =
	{
		GD: GD,
		UTM: UTM,
		GC: GC,
		getReferenceFrame: function (geoSystem, radians)
		{
			switch (getCoordinateSystem (geoSystem))
			{
				case GD:
				{
					return new Geodetic (this .getEllipsoid (geoSystem),
					                     this .getLatitudeFirst (geoSystem),
					                     radians);
				}
				case UTM:
				{
					return new UniversalTransverseMercator (this .getEllipsoid (geoSystem),
					                                        this .getZone (geoSystem),
					                                        this .getNorthernHemisphere (geoSystem),
					                                        this .getNorthingFirst (geoSystem));
				}
				case GC:
				{
					return new Geocentric ();
				}
			}

			return new Geodetic (ReferenceEllipsoids .WE, true, radians);
		},
		getElevationFrame: function (geoSystem, radians)
		{
			return new Geodetic (getEllipsoid (geoSystem), true, radians);
		},
		getCoordinateSystem: function (geoSystem)
		{
			for (var i = 0, length = geoSystem .length; i < length; ++ i)
			{
				var coordinateSystem = coordinateSystems [geoSystem [i]];

				if (coordinateSystem !== undefined)
					return coordinateSystem;
			}
		
			return GD;
		},
		getEllipsoid: function (geoSystem)
		{
			for (var i = 0, length = geoSystem .length; i < length; ++ i)
			{
				var ellipsoid = ReferenceEllipsoids [geoSystem [i]];

				if (ellipsoid !== undefined)
					return ellipsoid;
			}
		
			return ReferenceEllipsoids .WE;
		},
		getEllipsoidString: function (geoSystem)
		{
			for (var i = 0, length = geoSystem .length; i < length; ++ i)
			{
				var ellipsoid = ReferenceEllipsoids [geoSystem [i]];

				if (ellipsoid !== undefined)
					return geoSystem [i];
			}

			return "WE";
		},
		isStandardOrder: function (geoSystem)
		{
			switch (this .getCoordinateSystem (geoSystem))
			{
				case GD:
				{
					return this .getLatitudeFirst (geoSystem);
				}
				case UTM:
				{
					return this .getNorthingFirst (geoSystem);
				}
				case GC:
				{
					return true;
				}
			}
		
			return this .getLatitudeFirst (geoSystem);
		},
		getLatitudeFirst: function (geoSystem)
		{
			for (var i = 0, length = geoSystem .length; i < length; ++ i)
			{
				if (geoSystem [i] === "longitude_first")
					return false;
			}

			return true;
		},
		getNorthingFirst: function (geoSystem)
		{
			for (var i = 0, length = geoSystem .length; i < length; ++ i)
			{
				if (geoSystem [i] === "easting_first")
					return false;
			}
		
			return true;
		},
		getZone: function (geoSystem)
		{
			for (var i = 0, length = geoSystem .length; i < length; ++ i)
			{
				var match = geoSystem [i] .match (Zone);

				if (match)
					return parseInt (match [1]);
			}
		
			return 1;
		},
		getNorthernHemisphere: function (geoSystem)
		{
			for (var i = 0, length = geoSystem .length; i < length; ++ i)
			{
				if (geoSystem [i] === "S")
					return false;
			}

			return true;
		},
	};
	
	return Geospatial;
});
