
define ([
	"cobweb/Fields",
	"cobweb/Basic/X3DBaseNode",
	"cobweb/Components/Geometry3D/IndexedFaceSet",
	"cobweb/Components/Rendering/Coordinate",
	"cobweb/Components/Texturing/TextureCoordinate",
	"cobweb/Browser/Geometry3D/IcoSphere",
],
function (Fields,
          X3DBaseNode,
          IndexedFaceSet,
          Coordinate,
          TextureCoordinate,
          IcoSphere)
{
	with (Fields)
	{
		function IcoSphereOptions (executionContext)
		{
			X3DBaseNode .call (this, executionContext .getBrowser (), executionContext);

			this .addChildren ("type",  new SFString ("ICOSAHEDRON"),
			                   "order", new SFInt32 (2))
		}

		IcoSphereOptions .prototype = $.extend (Object .create (X3DBaseNode .prototype),
		{
			constructor: IcoSphereOptions,
			getTypeName: function ()
			{
				return "IcoSphereOptions";
			},
			getComponentName: function ()
			{
				return "Cobweb";
			},
			getContainerField: function ()
			{
				return "quadSphereOptions";
			},
			initialize: function ()
			{
				X3DBaseNode .prototype .initialize .call (this);

				this .addInterest (this, "eventsProcessed");
			},
			getGeometry: function ()
			{
				if (! this .geometry)
					this .eventsProcessed ();
				
				return this .geometry;
			},
			eventsProcessed: function ()
			{
				this .geometry            = new IndexedFaceSet (this .getExecutionContext ());
				this .geometry .texCoord_ = new TextureCoordinate (this .getExecutionContext ());
				this .geometry .coord_    = new Coordinate (this .getExecutionContext ());

				var
					geometry = this .geometry,
					texCoord = this .geometry .texCoord_ .getValue (),
					coord    = this .geometry .coord_ .getValue ();

				var icoSphere = new IcoSphere (this .type_ .getValue (), this .order_ .getValue (), 1);

				geometry .creaseAngle_ = Math .PI;

				texCoord .point_ = icoSphere .getTexPoint ();
				coord .point_    = icoSphere .getPoint ();

				geometry .texCoordIndex_ = icoSphere .getTexCoordIndex ();
				geometry .coordIndex_    = icoSphere .getCoordIndex ();

				texCoord .setup ();
				coord    .setup ();
				geometry .setup ();
			},
		});

		return IcoSphereOptions;
	}
});
