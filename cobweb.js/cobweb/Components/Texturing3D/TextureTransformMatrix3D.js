
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Texturing/X3DTextureTransformNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DTextureTransformNode, 
          X3DConstants)
{
"use strict";

	function TextureTransformMatrix3D (executionContext)
	{
		X3DTextureTransformNode .call (this, executionContext);

		this .addType (X3DConstants .TextureTransformMatrix3D);
	}

	TextureTransformMatrix3D .prototype = $.extend (Object .create (X3DTextureTransformNode .prototype),
	{
		constructor: TextureTransformMatrix3D,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput, "metadata", new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .inputOutput, "matrix",   new Fields .SFMatrix4f (1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)),
		]),
		getTypeName: function ()
		{
			return "TextureTransformMatrix3D";
		},
		getComponentName: function ()
		{
			return "Texturing3D";
		},
		getContainerField: function ()
		{
			return "textureTransform";
		},
		eventsProcessed: function ()
		{
			X3DTextureTransformNode .prototype .eventsProcessed .call (this);
			
			var matrix4 = this .getMatrix ();

			matrix4 .assign (this .matrix_ .getValue ());

			this .setMatrix (matrix4);
		},
	});

	return TextureTransformMatrix3D;
});


