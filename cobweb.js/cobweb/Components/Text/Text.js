
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
"use strict";

	function Text (executionContext)
	{
		X3DGeometryNode .call (this, executionContext);

		this .addType (X3DConstants .Text);
	}

	Text .prototype = $.extend (Object .create (X3DGeometryNode .prototype),
	{
		constructor: Text,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",   new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "string",     new Fields .MFString ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "length",     new Fields .MFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "maxExtent",  new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "solid",      new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "origin",     new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "textBounds", new Fields .SFVec2f ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "lineBounds", new Fields .MFVec2f ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "fontStyle",  new Fields .SFNode ()),
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
				return Math .max (0, this .length_ [index]);

			return 0;
		},
		set_live__: function ()
		{
		    X3DGeometryNode .prototype .set_live__ .call (this);

		   if (this .getExecutionContext () .isLive () .getValue () && this .isLive () .getValue ())
				this .getBrowser () .getBrowserOptions () .PrimitiveQuality_ .addInterest (this, "eventsProcessed");
		   else
				this .getBrowser () .getBrowserOptions () .PrimitiveQuality_ .removeInterest (this, "eventsProcessed");
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
});


