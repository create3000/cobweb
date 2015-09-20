
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Navigation/X3DViewpointNode",
	"cobweb/Components/Geospatial/X3DGeospatialObject",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DViewpointNode, 
          X3DGeospatialObject, 
          X3DConstants)
{
	with (Fields)
	{
		function GeoViewpoint (executionContext)
		{
			X3DViewpointNode    .call (this, executionContext .getBrowser (), executionContext);
			X3DGeospatialObject .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .GeoViewpoint);
		}

		GeoViewpoint .prototype = $.extend (Object .create (X3DViewpointNode .prototype),
			X3DGeospatialObject .prototype,
		{
			constructor: GeoViewpoint,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",          new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "set_bind",          new SFBool ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "description",       new SFString ("")),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "geoSystem",         new MFString ([ "GD", "WE" ])),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "position",          new SFVec3d (0, 0, 100000)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "orientation",       new SFRotation (0, 0, 1, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "centerOfRotation",  new SFVec3d (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "fieldOfView",       new SFFloat (0.785398)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "jump",              new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "retainUserOffsets", new SFBool ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "navType",           new MFString ([ "EXAMINE", "ANY" ])),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "headlight",         new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "speedFactor",       new SFFloat (1)),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "isBound",           new SFBool ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "bindTime",          new SFTime ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "geoOrigin",         new SFNode ()),
			]),
			getTypeName: function ()
			{
				return "GeoViewpoint";
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

		return GeoViewpoint;
	}
});

