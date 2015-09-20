
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Core/X3DNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DNode, 
          X3DConstants)
{
	with (Fields)
	{
		function GeoOrigin (executionContext)
		{
			X3DNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .GeoOrigin);
		}

		GeoOrigin .prototype = $.extend (Object .create (X3DNode .prototype),
		{
			constructor: GeoOrigin,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",  new SFNode ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "rotateYUp", new SFBool ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "geoSystem", new MFString ([ "GD", "WE" ])),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "geoCoords", new SFVec3d ()),
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
		});

		return GeoOrigin;
	}
});

