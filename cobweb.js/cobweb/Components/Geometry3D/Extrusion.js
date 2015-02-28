
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Rendering/X3DGeometryNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DGeometryNode, 
          X3DConstants)
{
	with (Fields)
	{
		function Extrusion (executionContext)
		{
			X3DGeometryNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .Extrusion);
		}

		Extrusion .prototype = $.extend (new X3DGeometryNode (),
		{
			constructor: Extrusion,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",     new SFNode ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "beginCap",     new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "endCap",       new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "solid",        new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "ccw",          new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "convex",       new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "creaseAngle",  new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "crossSection", new MFVec2f ([, 1, 1,, 1, -1,, -1, -1,, -1, 1,, 1, 1, ])),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "orientation",  new MFRotation (0, 0, 1, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "scale",        new MFVec2f (1, 1)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "spine",        new MFVec3f ([, 0, 0, 0,, 0, 1, 0, ])),
			]),
			getTypeName: function ()
			{
				return "Extrusion";
			},
			getComponentName: function ()
			{
				return "Geometry3D";
			},
			getContainerField: function ()
			{
				return "geometry";
			},
		});

		return Extrusion;
	}
});

