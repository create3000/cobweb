
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Rendering/X3DCoordinateNode",
	"cobweb/Components/Geospatial/X3DGeospatialObject",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DCoordinateNode, 
          X3DGeospatialObject, 
          X3DConstants)
{
"use strict";

	function GeoCoordinate (executionContext)
	{
		X3DCoordinateNode .call (this, executionContext .getBrowser (), executionContext);
		X3DGeospatialObject .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .GeoCoordinate);
	}

	GeoCoordinate .prototype = $.extend (Object .create (X3DCoordinateNode .prototype),new X3DGeospatialObject (),
	{
		constructor: GeoCoordinate,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",  new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "geoSystem", new Fields .MFString ([ "GD", "WE" ])),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "point",     new Fields .MFVec3d ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "geoOrigin", new Fields .SFNode ()),
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
		isEmpty: function ()
		{
			return this .point_ .length == 0;
		},
		getSize: function ()
		{
			return this .point_ .length;
		},
	});

	return GeoCoordinate;
});


