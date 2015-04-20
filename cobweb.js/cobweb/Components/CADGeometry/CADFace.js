
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/CADGeometry/X3DProductStructureChildNode",
	"cobweb/Components/Grouping/X3DBoundedObject",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DProductStructureChildNode, 
          X3DBoundedObject, 
          X3DConstants)
{
	with (Fields)
	{
		function CADFace (executionContext)
		{
			X3DProductStructureChildNode .call (this, executionContext .getBrowser (), executionContext);
			X3DBoundedObject .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .CADFace);
		}

		CADFace .prototype = $.extend (Object .create (X3DProductStructureChildNode .prototype),new X3DBoundedObject (),
		{
			constructor: CADFace,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",   new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "name",       new SFString ("")),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxSize",   new SFVec3f (-1, -1, -1)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxCenter", new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "shape",      new SFNode ()),
			]),
			getTypeName: function ()
			{
				return "CADFace";
			},
			getComponentName: function ()
			{
				return "CADGeometry";
			},
			getContainerField: function ()
			{
				return "children";
			},
		});

		return CADFace;
	}
});

