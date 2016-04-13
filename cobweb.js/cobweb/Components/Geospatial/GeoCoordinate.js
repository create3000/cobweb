
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Rendering/X3DCoordinateNode",
	"cobweb/Components/Geospatial/X3DGeospatialObject",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Geometry/Triangle3",
	"standard/Math/Numbers/Vector3",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DCoordinateNode, 
          X3DGeospatialObject, 
          X3DConstants,
          Triangle3,
          Vector3)
{
"use strict";

	function GeoCoordinate (executionContext)
	{
		X3DCoordinateNode   .call (this, executionContext);
		X3DGeospatialObject .call (this, executionContext);

		this .addType (X3DConstants .GeoCoordinate);

		this .points = [ ];                   // Transformed points in GC.
		this .origin = new Vector3 (0, 0, 0); // Origin of the reference frame.
	}

	GeoCoordinate .prototype = $.extend (Object .create (X3DCoordinateNode .prototype),
		X3DGeospatialObject .prototype,
	{
		constructor: GeoCoordinate,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",  new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "geoOrigin", new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "geoSystem", new Fields .MFString ("GD", "WE")),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "point",     new Fields .MFVec3d ()),
		]),
		getTypeName: function ()
		{
			return "GeoCoordinate";
		},
		getComponentName: function ()
		{
			return "Geospatial";
		},
		getContainerField: function ()
		{
			return "coord";
		},
		initialize: function ()
		{
			X3DCoordinateNode   .prototype .initialize .call (this);
			X3DGeospatialObject .prototype .initialize .call (this);
		
			this .addInterest (this, "eventsProcessed");
		
			this .eventsProcessed ();
		},
		eventsProcessed: function ()
		{
			var
				point  = this .point_ .getValue (),
				points = this .points;

			for (var i = 0, length = Math .min (point .length, points .length); i < length; ++ i)
				this .getCoord (point [i] .getValue (), points [i]);

			for (var length = point .length; i < length; ++ i)
			{
				var p = points [i] = new Vector3 (0, 0, 0);
				this .getCoord (point [i] .getValue (), p);
			}
		
			points .length = length;

			this .getCoord (Vector3 .Zero, this .origin);
		},
		isEmpty: function ()
		{
			return this .point_ .length == 0;
		},
		getSize: function ()
		{
			return this .point_ .length;
		},
		get1Point: function (index)
		{
			// The index cannot be less than 0.

			if (index < this .points .length)
				return this .points [index];

			return this .origin;
		},
		getNormal: function (index1, index2, index3)
		{
			// The index[1,2,3] cannot be less than 0.

			var
				points = this .points,
				length = points .length;

			if (index1 < length && index2 < length && index3 < length)
				return Triangle3 .normal (points [index1],
				                          points [index2],
				                          points [index3],
				                          new Vector3 (0, 0, 0));

			return new Vector3 (0, 0, 0);
		},
		getQuadNormal: function (index1, index2, index3, index4)
		{
			// The index[1,2,3,4] cannot be less than 0.

			var
				points = this .points,
				length = points .length;

			if (index1 < length && index2 < length && index3 < length && index4 < length)
				return Triangle3 .quadNormal (points [index1],
				                              points [index2],
				                              points [index3],
				                              points [index4],
				                              new Vector3 (0, 0, 0));

			return new Vector3 (0, 0, 0);
		},
	});

	return GeoCoordinate;
});


