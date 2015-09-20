
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
		function NurbsCurve (executionContext)
		{
			X3DParametricGeometryNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .NurbsCurve);
		}

		NurbsCurve .prototype = $.extend (Object .create (X3DParametricGeometryNode .prototype),
		{
			constructor: NurbsCurve,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",     new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "controlPoint", new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "tessellation", new SFInt32 ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "weight",       new MFDouble ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "closed",       new SFBool ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "knot",         new MFDouble ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "order",        new SFInt32 (3)),
			]),
			getTypeName: function ()
			{
				return "NurbsCurve";
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

		return NurbsCurve;
	}
});

