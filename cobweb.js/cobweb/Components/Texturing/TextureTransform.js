
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Texturing/X3DTextureTransformNode",
	"cobweb/Bits/X3DConstants",
	"standard/Math/Numbers/Vector2",
	"standard/Math/Numbers/Matrix3",
	"standard/Math/Numbers/Matrix4",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DTextureTransformNode, 
          X3DConstants,
          Vector2,
          Matrix3,
          Matrix4)
{
	with (Fields)
	{
		function TextureTransform (executionContext)
		{
			X3DTextureTransformNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .TextureTransform);
		}

		TextureTransform .prototype = $.extend (new X3DTextureTransformNode (),
		{
			constructor: TextureTransform,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput, "metadata",    new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "translation", new SFVec2f (0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "rotation",    new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput, "scale",       new SFVec2f (1, 1)),
				new X3DFieldDefinition (X3DConstants .inputOutput, "center",      new SFVec2f (0, 0)),
			]),
			getTypeName: function ()
			{
				return "TextureTransform";
			},
			getComponentName: function ()
			{
				return "Texturing";
			},
			getContainerField: function ()
			{
				return "textureTransform";
			},
			initialize: function ()
			{
				X3DTextureTransformNode .prototype .initialize .call (this);
				
				this .addInterest (this, "update");

				this .update ();
			},
			update: function ()
			{
				var matrix = new Matrix3 ();

				if (! this .center_ .getValue () .equals (new Vector2 ()))
					matrix .translate (this .center_ .getValue () .negate ());

				if (! this .scale_ .getValue () .equals (new Vector2 (1, 1)))
					matrix .scale (this .scale_ .getValue ());

				if (this .rotation_ .getValue () !== 0)
					matrix .rotate (this .rotation_ .getValue ());

				if (! this .center_ .getValue () .equals (new Vector2 ()))
					matrix .translate (this .center_ .getValue ());

				if (! this .translation_ .getValue () .equals (new Vector2 ()))
					matrix .translate (this .translation_ .getValue ());

				this .setMatrix (new Matrix4 (matrix [0], matrix [1], 0, matrix [2],
				                              matrix [3], matrix [4], 0, matrix [5],
				                              0, 0, 1, 0,
				                              matrix [6], matrix [7], 0, matrix [8]));
			},
		});

		return TextureTransform;
	}
});

