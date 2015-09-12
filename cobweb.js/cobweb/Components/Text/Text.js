
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Rendering/X3DGeometryNode",
	"cobweb/Bits/X3DCast",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DGeometryNode, 
          X3DCast,
          X3DConstants)
{
	with (Fields)
	{
		function Text (executionContext)
		{
			X3DGeometryNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .Text);
		}

		Text .prototype = $.extend (Object .create (X3DGeometryNode .prototype),
		{
			constructor: Text,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",   new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "string",     new MFString ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "length",     new MFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "maxExtent",  new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "solid",      new SFBool (false)),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "origin",     new SFVec3f ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "textBounds", new SFVec2f ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "lineBounds", new MFVec2f ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "fontStyle",  new SFNode ()),
			]),
			getTypeName: function ()
			{
				return "Text";
			},
			getComponentName: function ()
			{
				return "Text";
			},
			getContainerField: function ()
			{
				return "geometry";
			},
			initialize: function ()
			{
			   X3DGeometryNode .prototype .initialize .call (this);

			   this .fontStyle_ .addInterest (this, "set_fontStyle__");
	
				this .set_fontStyle__ ();
				this .eventsProcessed ();
			},
			getLength: function (index)
			{
				if (index < this .length_ .length)
					return this .length_ [index];

				return 0;
			},
			set_fontStyle__: function ()
			{
			   if (this .fontStyleNode)
			      this .fontStyleNode .removeInterest (this, "addNodeEvent");

				this .fontStyleNode = X3DCast (X3DConstants .X3DFontStyleNode, this .fontStyle_);

				if (! this .fontStyleNode)
					this .fontStyleNode = this .getBrowser () .getDefaultFontStyle ();

			   this .fontStyleNode .addInterest (this, "addNodeEvent");

			   this .textGeometry = this .fontStyleNode .getTextGeometry (this);
			},
			build: function ()
			{
			   this .textGeometry .update ();
			   this .textGeometry .build ();

				this .setSolid (this .solid_ .getValue ());
			},
		});

		return Text;
	}
});

