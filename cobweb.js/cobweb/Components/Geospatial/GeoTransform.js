
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

	var
		matrix         = new Matrix4 (),
		locationMatrix = new Matrix4 ();

	function GeoTransform (executionContext)
	{
		X3DTransformMatrix4DNode .call (this, executionContext);
		X3DGeospatialObject      .call (this, executionContext);

		this .addType (X3DConstants .GeoTransform);
	}

	GeoTransform .prototype = $.extend (Object .create (X3DTransformMatrix4DNode .prototype),
		X3DGeospatialObject .prototype,
	{
		constructor: GeoTransform,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",         new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "geoOrigin",        new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "geoSystem",        new Fields .MFString ("GD", "WE")),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "geoCenter",        new Fields .SFVec3d ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "translation",      new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "rotation",         new Fields .SFRotation ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "scale",            new Fields .SFVec3f (1, 1, 1)),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "scaleOrientation", new Fields .SFRotation ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxSize",         new Fields .SFVec3f (-1, -1, -1)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxCenter",       new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,      "addChildren",      new Fields .MFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOnly,      "removeChildren",   new Fields .MFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "children",         new Fields .MFNode ()),
		]),
		getTypeName: function ()
		{
			return "GeoTransform";
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
			X3DTransformMatrix4DNode .prototype .initialize .call (this);
			X3DGeospatialObject      .prototype .initialize .call (this);
		
			this .addInterest (this, "eventsProcessed");
		
			this .eventsProcessed ();
		},
		eventsProcessed: function ()
		{
			matrix .set (this .translation_      .getValue (),
			             this .rotation_         .getValue (),
			             this .scale_            .getValue (),
			             this .scaleOrientation_ .getValue ());

			this .setMatrix (matrix .multRight (this .getLocationMatrix (this .geoCenter_ .getValue (), locationMatrix)));
		},
	});

	return GeoTransform;
});


