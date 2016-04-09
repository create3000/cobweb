
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Grouping/X3DTransformMatrix4DNode",
	"cobweb/Components/Geospatial/X3DGeospatialObject",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Matrix4",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DTransformMatrix4DNode, 
          X3DGeospatialObject, 
          X3DConstants,
          Matrix4)
{
"use strict";

	var matrix = new Matrix4 ();

	function GeoLocation (executionContext)
	{
		X3DTransformMatrix4DNode .call (this, executionContext);
		X3DGeospatialObject      .call (this, executionContext);

		this .addType (X3DConstants .GeoLocation);
	}

	GeoLocation .prototype = $.extend (Object .create (X3DTransformMatrix4DNode .prototype),
		X3DGeospatialObject .prototype,
	{
		constructor: GeoLocation,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",       new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "geoSystem",      new Fields .MFString ([ "GD", "WE" ])),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "geoCoords",      new Fields .SFVec3d ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "geoOrigin",      new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxSize",       new Fields .SFVec3f (-1, -1, -1)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxCenter",     new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,      "addChildren",    new Fields .MFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,      "removeChildren", new Fields .MFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "children",       new Fields .MFNode ()),
		]),
		getTypeName: function ()
		{
			return "GeoLocation";
		},
		getComponentName: function ()
		{
			return "Geospatial";
		},
		getContainerField: function ()
		{
			return "children";
		},
		initialize: function ()
		{
			X3DTransformMatrix3DNode .prototype .initialize .call (this);
			X3DGeospatialObject      .prototype .initialize .call (this);
		
			this .addInterest (this, "eventsProcessed");
		
			this .eventsProcessed ();
		},
		eventsProcessed: function ()
		{
			this .setMatrix (this .getLocationMatrix (this .geoCoords_ .getValue (), matrix));
		},
	});

	return GeoLocation;
});


