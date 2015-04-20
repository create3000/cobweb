
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Core/X3DChildNode",
	"cobweb/Components/Grouping/X3DBoundedObject",
	"cobweb/Components/Geospatial/X3DGeospatialObject",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DChildNode, 
          X3DBoundedObject, 
          X3DGeospatialObject, 
          X3DConstants)
{
	with (Fields)
	{
		function GeoLOD (executionContext)
		{
			X3DChildNode .call (this, executionContext .getBrowser (), executionContext);
			X3DBoundedObject .call (this, executionContext .getBrowser (), executionContext);
			X3DGeospatialObject .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .GeoLOD);
		}

		GeoLOD .prototype = $.extend (Object .create (X3DChildNode .prototype),new X3DBoundedObject (),new X3DGeospatialObject (),
		{
			constructor: GeoLOD,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",      new SFNode ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "geoSystem",     new MFString ([, "GD",, "WE", ])),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "rootUrl",       new MFString ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "child1Url",     new MFString ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "child2Url",     new MFString ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "child3Url",     new MFString ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "child4Url",     new MFString ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "center",        new SFVec3d (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "range",         new SFFloat (10)),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "level_changed", new SFInt32 ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "geoOrigin",     new SFNode ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "rootNode",      new MFNode ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxSize",      new SFVec3f (-1, -1, -1)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxCenter",    new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "children",      new MFNode ()),
			]),
			getTypeName: function ()
			{
				return "GeoLOD";
			},
			getComponentName: function ()
			{
				return "Geospatial";
			},
			getContainerField: function ()
			{
				return "children";
			},
		});

		return GeoLOD;
	}
});

