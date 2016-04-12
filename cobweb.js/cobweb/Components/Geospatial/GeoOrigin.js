
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Core/X3DNode",
	"cobweb/Bits/X3DConstants",
	"cobweb/Browser/Geospatial/Geospatial",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DNode, 
          X3DConstants,
          Geospatial)
{
"use strict";

	function GeoOrigin (executionContext)
	{
		X3DNode .call (this, executionContext);

		this .addType (X3DConstants .GeoOrigin);

		this .radians = true;
	}

	GeoOrigin .prototype = $.extend (Object .create (X3DNode .prototype),
	{
		constructor: GeoOrigin,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",  new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "rotateYUp", new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "geoSystem", new Fields .MFString ("GD", "WE")),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "geoCoords", new Fields .SFVec3d ()),
		]),
		getTypeName: function ()
		{
			return "GeoOrigin";
		},
		getComponentName: function ()
		{
			return "Geospatial";
		},
		getContainerField: function ()
		{
			return "geoOrigin";
		},
		initialize: function ()
		{
			X3DNode .prototype .initialize .call (this);

			this .geoSystem_ .addInterest (this, "set_geoSystem__");

			switch (this .getExecutionContext () .specificationVersion)
			{
				case "2.0":
				case "3.0":
				case "3.1":
				case "3.2":
					this .radians = false;
					break;
			}

			this .set_geoSystem__ ();
		},
		set_geoSystem__: function ()
		{
			this .referenceFrame = Geospatial .getReferenceFrame (this .geoSystem_, this .radians);
		},
		getOrigin: function (result)
		{
			return this .referenceFrame .convert (this .geoCoords_ .getValue (), result);
		},
	});

	return GeoOrigin;
});


