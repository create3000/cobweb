
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/NURBS/X3DParametricGeometryNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DParametricGeometryNode, 
          X3DConstants)
{
	with (Fields)
	{
		function NurbsSwungSurface (executionContext)
		{
			X3DParametricGeometryNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .NurbsSwungSurface);
		}

		NurbsSwungSurface .prototype = $.extend (new X3DParametricGeometryNode (),
		{
			constructor: NurbsSwungSurface,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",        new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "profileCurve",    new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "trajectoryCurve", new SFNode ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "solid",           new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "ccw",             new SFBool (true)),
			]),
			getTypeName: function ()
			{
				return "NurbsSwungSurface";
			},
			getComponentName: function ()
			{
				return "NURBS";
			},
			getContainerField: function ()
			{
				return "geometry";
			},
		});

		return NurbsSwungSurface;
	}
});

