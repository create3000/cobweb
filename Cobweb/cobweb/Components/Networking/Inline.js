
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Core/X3DChildNode",
	"cobweb/Components/Networking/X3DUrlObject",
	"cobweb/Components/Grouping/X3DBoundedObject",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DChildNode,
          X3DUrlObject,
          X3DBoundedObject,
          X3DConstants)
{
	with (Fields)
	{
		function Inline (executionContext)
		{
			X3DChildNode     .call (this, executionContext .getBrowser (), executionContext);
			X3DUrlObject     .call (this, executionContext .getBrowser (), executionContext);
			X3DBoundedObject .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .Inline);
		}

		Inline .prototype = $.extend (new X3DChildNode (),
			X3DUrlObject .prototype,
			X3DBoundedObject .prototype,
		{
			constructor: Inline,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",   new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "load",       new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "url",        new MFString ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxSize",   new SFVec3f (-1, -1, -1)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxCenter", new SFVec3f ()),
			]),
			getTypeName: function ()
			{
				return "Inline";
			},
			getComponentName: function ()
			{
				return "Networking";
			},
			getContainerField: function ()
			{
				return "children";
			},
			initialize: function ()
			{
				X3DChildNode     .prototype .initialize .call (this);
				X3DUrlObject     .prototype .initialize .call (this);
				X3DBoundedObject .prototype .initialize .call (this);
			},
		});

		return Inline;
	}
});
